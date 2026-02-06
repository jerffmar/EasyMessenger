import { useState, useEffect, useCallback } from 'react';
import { mockApiService, mockSocketService, MOCK_CHATS } from '../mockData';

// Hook para gerenciar o estado da conexão
export const useConnectionState = () => {
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, user: null });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialStatus = async () => {
      try {
        const status = await mockApiService.getSessionStatus();
        setConnectionStatus(status);
        setQrCode(mockApiService.getCurrentQRCode());
      } catch (error) {
        console.error('Failed to load initial status:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialStatus();
  }, []);

  const handleConnect = useCallback(async () => {
    try {
      await mockApiService.simulateConnection();
      const status = await mockApiService.getSessionStatus();
      setConnectionStatus(status);
      setQrCode(null);
      mockSocketService.connect();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    try {
      await mockApiService.logout();
      setConnectionStatus({ connected: false, user: null });
      setQrCode(null);
      mockSocketService.disconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  }, []);

  const generateQR = useCallback(() => {
    mockSocketService.simulateQRCode();
    const qr = mockApiService.getCurrentQRCode();
    setQrCode(qr);
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
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const chatsData = await mockApiService.getChats();
        setChats(chatsData);
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  const refreshChats = useCallback(async () => {
    try {
      const chatsData = await mockApiService.getChats();
      setChats(chatsData);
    } catch (error) {
      console.error('Failed to refresh chats:', error);
    }
  }, []);

  const sendMessage = useCallback(async (chatId: string, text: string) => {
    try {
      // Find the chat to get the phone number
      const chat = chats.find(c => c.id === chatId);
      if (!chat) return null;

      const result = await mockApiService.sendMessage('5511999999999', text);
      
      // Add message to local state
      const newMessage = {
        id: result.message_id,
        text,
        fromMe: true,
        timestamp: new Date(),
        status: 'sent'
      };

      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId 
            ? { 
                ...chat, 
                messages: [...(chat.messages || []), newMessage],
                lastMessage: text,
                timestamp: 'Agora'
              }
            : chat
        )
      );

      return result;
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  }, [chats]);

  return {
    chats,
    loading,
    refreshChats,
    sendMessage
  };
};

// Hook para simular eventos do socket
export const useMockSocket = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // Subscribe to socket events
    const unsubscribeQR = mockSocketService.on('qr_code', (qr: string) => {
      setEvents(prev => [...prev, { type: 'qr_code', data: qr, timestamp: new Date() }]);
    });

    const unsubscribeConnection = mockSocketService.on('connection_update', (update: any) => {
      setEvents(prev => [...prev, { type: 'connection_update', data: update, timestamp: new Date() }]);
    });

    const unsubscribeMessage = mockSocketService.on('message_upsert', (message: any) => {
      setEvents(prev => [...prev, { type: 'message_upsert', data: message, timestamp: new Date() }]);
    });

    const unsubscribeChats = mockSocketService.on('chats_update', (chats: any) => {
      setEvents(prev => [...prev, { type: 'chats_update', data: chats, timestamp: new Date() }]);
    });

    return () => {
      unsubscribeQR();
      unsubscribeConnection();
      unsubscribeMessage();
      unsubscribeChats();
    };
  }, []);

  const simulateNewMessage = useCallback(() => {
    mockSocketService.simulateNewMessage();
  }, []);

  const simulateConnectionUpdate = useCallback((connected: boolean) => {
    mockSocketService.simulateConnectionUpdate(connected);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    simulateNewMessage,
    simulateConnectionUpdate,
    clearEvents
  };
};

// Hook para métricas do dashboard
export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    messagesToday: 1245,
    activeSessions: 1,
    errorRate: 0.4,
    averageTime: 1.2,
    messageVolume: [45, 78, 55, 90, 82, 65, 95],
    trends: {
      messages: { value: '+12%', up: true },
      errors: { value: '-2%', up: true }
    }
  });

  const refreshMetrics = useCallback(() => {
    // Simulate metrics update
    setMetrics(prev => ({
      ...prev,
      messagesToday: prev.messagesToday + Math.floor(Math.random() * 10),
      averageTime: Math.random() * 2 + 0.5,
      messageVolume: prev.messageVolume.map(v => 
        Math.max(20, Math.min(100, v + (Math.random() - 0.5) * 20))
      )
    }));
  }, []);

  return {
    metrics,
    refreshMetrics
  };
};
