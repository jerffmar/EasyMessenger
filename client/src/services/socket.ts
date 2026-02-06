import { io } from 'socket.io-client';
import { Message, Chat } from '../types';

// Auto-detect server URL based on environment
const getServerUrl = () => {
  // Check if VITE_SERVER_URL is set (for production)
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL;
  }
  
  // Check if we're in production (deployed)
  if (import.meta.env.MODE === 'production') {
    // In production, use the same origin as the frontend
    return window.location.origin;
  }
  
  // Development fallback
  return 'http://localhost:3001';
};

interface Socket {
  connected: boolean;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
  disconnect(): void;
}

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    if (this.socket?.connected) {
      return;
    }

    const serverUrl = getServerUrl();
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, reconnect manually
        this.reconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnect();
    });
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Event listeners
  onQRCode(callback: (qr: string) => void) {
    this.socket?.on('qr_code', callback);
  }

  onConnectionUpdate(callback: (update: any) => void) {
    this.socket?.on('connection_update', callback);
  }

  onMessageUpsert(callback: (message: Message) => void) {
    this.socket?.on('message_upsert', callback);
  }

  onChatsUpdate(callback: (chats: Chat[]) => void) {
    this.socket?.on('chats_update', callback);
  }

  // Remove event listeners
  offQRCode(callback: (qr: string) => void) {
    this.socket?.off('qr_code', callback);
  }

  offConnectionUpdate(callback: (update: any) => void) {
    this.socket?.off('connection_update', callback);
  }

  offMessageUpsert(callback: (message: Message) => void) {
    this.socket?.off('message_upsert', callback);
  }

  offChatsUpdate(callback: (chats: Chat[]) => void) {
    this.socket?.off('chats_update', callback);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
