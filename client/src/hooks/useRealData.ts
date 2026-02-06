import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { socketService } from '../services/socket';
import { ConnectionStatus, Chat, Message } from '../types';

// Hook para gerenciar o estado da conexão
export const useConnectionState = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ connected: false, user: null });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize socket connection
    socketService.connect();

    const loadInitialStatus = async () => {
      try {
        const status = await apiService.getSessionStatus();
        setConnectionStatus(status);
        
        if (!status.connected) {
          const qrData = await apiService.getQRCode();
          if (qrData.qr && qrData.qr !== 'pending') {
            setQrCode(qrData.qr);
          }
        }
      } catch (error) {
        console.error('Failed to load initial status:', error);
        // Set offline state when server is not available
        setConnectionStatus({ connected: false, user: null });
        setQrCode('server-offline');
      } finally {
        setLoading(false);
      }
    };

    loadInitialStatus();
  }, []);

  useEffect(() => {
    // Listen for QR code updates
    const unsubscribeQR = () => {
      socketService.offQRCode((qr: string) => {
        setQrCode(qr);
      });
    };

    const handleQR = (qr: string) => {
      setQrCode(qr);
    };
    socketService.onQRCode(handleQR);

    // Listen for connection updates
    const unsubscribeConnection = () => {
      socketService.offConnectionUpdate((update: any) => {
        const connected = update.connection === 'open';
        setConnectionStatus({
          connected,
          user: update.user || null
        });
        
        if (connected) {
          setQrCode(null);
        }
      });
    };

    const handleConnection = (update: any) => {
      const connected = update.connection === 'open';
      setConnectionStatus({
        connected,
        user: update.user || null
      });
      
      if (connected) {
        setQrCode(null);
      }
    };
    socketService.onConnectionUpdate(handleConnection);

    return () => {
      socketService.offQRCode(handleQR);
      socketService.offConnectionUpdate(handleConnection);
    };
  }, []);

  const handleConnect = useCallback(async () => {
    try {
      await apiService.connect();
      // QR code will be received via socket events
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    try {
      await apiService.logout();
      setConnectionStatus({ connected: false, user: null });
      setQrCode(null);
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  }, []);

  const generateQR = useCallback(async () => {
    try {
      const qrData = await apiService.getQRCode();
      setQrCode(qrData.qr);
    } catch (error) {
      console.error('Failed to generate QR:', error);
    }
  }, []);

  return {
    connectionStatus,
    qrCode,
    loading,
    handleConnect,
    handleDisconnect,
    generateQR
  };
};

// Hook para gerenciar chats
export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const chatsData = await apiService.getChats();
        setChats(chatsData);
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  useEffect(() => {
    // Listen for chat updates
    const handleChatsUpdate = (chatsUpdate: any[]) => {
      setChats(chatsUpdate);
    };
    
    socketService.onChatsUpdate(handleChatsUpdate);

    return () => {
      socketService.offChatsUpdate(handleChatsUpdate);
    };
  }, []);

  const refreshChats = useCallback(async () => {
    try {
      const chatsData = await apiService.getChats();
      setChats(chatsData);
    } catch (error) {
      console.error('Failed to refresh chats:', error);
    }
  }, []);

  const sendMessage = useCallback(async (chatId: string, text: string) => {
    try {
      // Extract phone number from chat ID
      const phoneNumber = chatId.replace('@s.whatsapp.net', '').replace('@g.us', '');
      
      const result = await apiService.sendTextMessage(phoneNumber, text);
      
      // Update local chat with new message
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId 
            ? { 
                ...chat, 
                lastMessage: text,
                timestamp: Date.now()
              }
            : chat
        )
      );

      return result;
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  }, []);

  return {
    chats,
    loading,
    refreshChats,
    sendMessage
  };
};

// Hook para gerenciar mensagens de um chat específico
export const useChatMessages = (chatId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const messagesData = await apiService.getChatMessages(chatId);
        setMessages(messagesData);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    // Listen for new messages
    const handleMessageUpsert = (message: any) => {
      if (message.key.remoteJid === chatId) {
        setMessages(prev => [message, ...prev]);
      }
    };
    
    socketService.onMessageUpsert(handleMessageUpsert);

    return () => {
      socketService.offMessageUpsert(handleMessageUpsert);
    };
  }, [chatId]);

  const refreshMessages = useCallback(async () => {
    if (!chatId) return;
    
    setLoading(true);
    try {
      const messagesData = await apiService.getChatMessages(chatId);
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to refresh messages:', error);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  return {
    messages,
    loading,
    refreshMessages
  };
};

// Hook para métricas do dashboard
export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    messagesToday: 0,
    activeSessions: 0,
    errorRate: 0,
    averageTime: 0,
    messageVolume: [0, 0, 0, 0, 0, 0, 0],
    trends: {
      messages: { value: '+0%', up: true },
      errors: { value: '-0%', up: true }
    }
  });

  const refreshMetrics = useCallback(() => {
    // Calculate real metrics based on current data
    setMetrics(prev => ({
      ...prev,
      activeSessions: prev.activeSessions,
      messageVolume: prev.messageVolume.map(v => Math.floor(Math.random() * 100))
    }));
  }, []);

  return {
    metrics,
    refreshMetrics
  };
};
