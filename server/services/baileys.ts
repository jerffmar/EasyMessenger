import { EventEmitter } from 'events';
import { makeWASocket, useMultiFileAuthState, DisconnectReason, isJidBroadcast, isJidGroup, WAMessage, WASocket } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface ConnectionUpdate {
  connection: 'open' | 'close' | 'connecting' | 'refresher';
  lastDisconnect?: {
    error: Boom;
    date: Date;
  };
  qr?: string;
  isNewLogin?: boolean;
  receivedPendingNotifications?: boolean;
}

export interface MessageInfo {
  key: {
    remoteJid: string;
    id: string;
    fromMe: boolean;
  };
  message: any;
  messageTimestamp: number;
  status: 'ERROR' | 'PENDING' | 'SERVER_ACK' | 'DELIVERY_ACK' | 'READ' | 'PLAYED';
}

export interface ChatInfo {
  id: string;
  name?: string;
  unreadCount: number;
  lastMessage?: string;
  timestamp: number;
  isGroup: boolean;
}

class BaileysService extends EventEmitter {
  private socket: WASocket | null = null;
  private authState: any = null;
  private sessionPath: string;
  private logger: pino.Logger;
  private chats: Map<string, ChatInfo> = new Map();
  private messages: Map<string, WAMessage[]> = new Map();
  private webhookUrl: string | null = null;
  private currentQRCode: string | null = null;

  constructor() {
    super();
    this.sessionPath = process.env.SESSION_PATH || './auth_info';
    
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info'
    });
    
    // Safety check: prevent creating directories at root level
    if (this.sessionPath === '/auth' || (this.sessionPath.startsWith('/auth') && this.sessionPath.split('/').length <= 3)) {
      this.logger.warn('Dangerous session path detected, using relative path instead');
      this.sessionPath = './auth_info';
    }
    
    this.logger.info(`Session path: ${this.sessionPath}`);
    this.ensureAuthDirectory();
  }

  private ensureAuthDirectory() {
    try {
      if (!existsSync(this.sessionPath)) {
        this.logger.info(`Creating auth directory: ${this.sessionPath}`);
        mkdirSync(this.sessionPath, { recursive: true });
      } else {
        this.logger.info(`Auth directory already exists: ${this.sessionPath}`);
      }
    } catch (error) {
      this.logger.error(`Failed to create auth directory ${this.sessionPath}: ${error}`);
      throw error;
    }
  }

  async initialize() {
    try {
      this.logger.info('Initializing WhatsApp connection...');
      
      const { state, saveCreds } = await useMultiFileAuthState(this.sessionPath);
      this.authState = { state, saveCreds };

      this.socket = makeWASocket({
        logger: this.logger,
        auth: state,
        printQRInTerminal: false,
        browser: ['WhatsApp Manager', 'Chrome', '4.0.0'],
        shouldSyncHistoryMessage: () => false,
        syncFullHistory: false,
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key: any) => {
          return undefined; // Implement message store if needed
        }
      });

      this.setupEventListeners();
      
    } catch (error) {
      this.logger.error({ msg: 'Failed to initialize WhatsApp:', error });
      this.emit('connection_update', {
        connection: 'close',
        lastDisconnect: {
          error: error as Boom,
          date: new Date()
        }
      });
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.ev.on('connection.update', (update: any) => {
      const { connection, lastDisconnect, qr, isNewLogin } = update;
      
      this.logger.info({ msg: 'Connection update:', connection, isNewLogin });

      if (qr) {
        this.currentQRCode = qr;
        this.emit('qr_code', qr);
      }

      if (connection === 'open') {
        this.logger.info('WhatsApp connection opened');
        this.currentQRCode = null; // Clear QR code when connected
        this.loadChats();
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        this.logger.info({ msg: 'WhatsApp connection closed:', shouldReconnect });
        
        if (shouldReconnect) {
          setTimeout(() => this.initialize(), 5000);
        }
      }

      this.emit('connection_update', update);
    });

    this.socket.ev.on('creds.update', (saveCreds: any) => {
      if (this.authState?.saveCreds) {
        this.authState.saveCreds(saveCreds);
      }
    });

    this.socket.ev.on('messages.upsert', ({ messages, type }: any) => {
      if (type === 'notify' && messages.length > 0) {
        for (const message of messages) {
          if (!message.key.fromMe && !isJidBroadcast(message.key.remoteJid)) {
            this.handleNewMessage(message);
            this.emit('message_upsert', message);
            
            // Send webhook if configured
            if (this.webhookUrl) {
              this.sendWebhook(message);
            }
          }
        }
      }
    });

    (this.socket.ev as any).on('chats.set', ({ chats }: any) => {
      this.logger.info(`Received ${chats.length} chats`);
      for (const chat of chats) {
        this.updateChat(chat);
      }
      this.emit('chats_update', Array.from(this.chats.values()));
    });

    this.socket.ev.on('chats.upsert', (chats: any) => {
      for (const chat of chats) {
        this.updateChat(chat);
      }
      this.emit('chats_update', Array.from(this.chats.values()));
    });

    this.socket.ev.on('chats.update', (updates: any) => {
      for (const update of updates) {
        const chatId = update.id;
        if (!chatId) continue;
        
        const chat = this.chats.get(chatId);
        if (chat) {
          Object.assign(chat, update);
          this.chats.set(chatId, chat);
        }
      }
      this.emit('chats_update', Array.from(this.chats.values()));
    });
  }

  private handleNewMessage(message: WAMessage) {
    const chatId = message.key.remoteJid;
    if (!chatId) return;
    
    // Store message
    if (!this.messages.has(chatId)) {
      this.messages.set(chatId, []);
    }
    const chatMessages = this.messages.get(chatId)!;
    chatMessages.push(message);
    
    // Keep only last 100 messages per chat
    if (chatMessages.length > 100) {
      chatMessages.shift();
    }
    
    // Update chat info
    const chat = this.chats.get(chatId);
    if (chat) {
      chat.unreadCount++;
      chat.lastMessage = this.getMessageText(message);
      chat.timestamp = Date.now();
      this.chats.set(chatId, chat);
    }
  }

  private getMessageText(message: WAMessage): string {
    if (message.message?.conversation) {
      return message.message.conversation;
    }
    if (message.message?.extendedTextMessage?.text) {
      return message.message.extendedTextMessage.text;
    }
    if (message.message?.imageMessage?.caption) {
      return `📷 ${message.message.imageMessage.caption}`;
    }
    if (message.message?.videoMessage?.caption) {
      return `🎥 ${message.message.videoMessage.caption}`;
    }
    if (message.message?.audioMessage) {
      return '🎵 Audio message';
    }
    if (message.message?.documentMessage) {
      return `📄 ${message.message.documentMessage.fileName || 'Document'}`;
    }
    return 'Media message';
  }

  private updateChat(chat: any) {
    const chatId = chat.id;
    if (!chatId) return;
    
    const chatInfo: ChatInfo = {
      id: chatId,
      name: chat.name || chatId.replace('@s.whatsapp.net', '').replace('@g.us', ''),
      unreadCount: chat.unreadCount || 0,
      lastMessage: chat.lastMessage?.messageStubType ? undefined : this.getMessageText(chat.lastMessage),
      timestamp: chat.lastMessage?.messageTimestamp || Date.now(),
      isGroup: isJidGroup(chatId) || false
    };
    
    this.chats.set(chatId, chatInfo);
  }

  private async loadChats() {
    if (!this.socket) return;
    
    try {
      // fetchChats method doesn't exist in current Baileys version
      // Use the chats from events instead
      this.logger.info('Chats will be loaded via events');
    } catch (error) {
      this.logger.error({ msg: 'Failed to load chats:', error });
    }
  }

  async sendMessage(number: string, text: string): Promise<any> {
    if (!this.socket) {
      throw new Error('WhatsApp not connected');
    }

    try {
      const jid = `${number}@s.whatsapp.net`;
      const result = await this.socket.sendMessage(jid, { text });
      
      this.logger.info({ msg: 'Message sent:', jid, text });
      return result;
    } catch (error) {
      this.logger.error({ msg: 'Failed to send message:', error });
      throw error;
    }
  }

  async getChatMessages(chatId: string, limit: number = 50): Promise<WAMessage[]> {
    if (!this.socket) {
      throw new Error('WhatsApp not connected');
    }

    try {
      const messages = this.messages.get(chatId) || [];
      // Return messages in reverse order (newest first) and limit
      return messages.slice(-limit).reverse();
    } catch (error) {
      this.logger.error({ msg: 'Failed to fetch messages:', error });
      throw error;
    }
  }

  async getConnectionStatus() {
    if (!this.socket) {
      return {
        connected: false,
        user: null
      };
    }

    const user = this.socket.user;
    return {
      connected: (this.socket.ws as any)?.readyState === 1,
      user: user ? {
        id: user.id,
        name: user.name || user.verifiedName || undefined,
        pictureUrl: await this.getProfilePicture(user.id)
      } : null
    };
  }

  getCurrentQRCode(): string | null {
    return this.currentQRCode;
  }

  private async getProfilePicture(jid: string): Promise<string | null> {
    if (!this.socket) return null;
    
    try {
      const url = await this.socket.profilePictureUrl(jid, 'image');
      return url || null;
    } catch {
      return null;
    }
  }

  async logout() {
    if (!this.socket) return;

    try {
      await this.socket.logout();
      this.socket = null;
      this.chats.clear();
      this.messages.clear();
      this.logger.info('Logged out successfully');
    } catch (error) {
      this.logger.error({ msg: 'Failed to logout:', error });
      throw error;
    }
  }

  setWebhook(url: string | null) {
    this.webhookUrl = url;
    this.logger.info({ msg: 'Webhook updated:', url });
  }

  private async sendWebhook(message: WAMessage) {
    if (!this.webhookUrl) return;

    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'message',
          data: message
        })
      });
    } catch (error) {
      this.logger.error({ msg: 'Failed to send webhook:', error });
    }
  }

  getChats(): ChatInfo[] {
    return Array.from(this.chats.values());
  }
}

export const baileysService = new BaileysService();
