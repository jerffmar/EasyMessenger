import { useEffect, useCallback } from 'react';
import { socketService } from '../services/socket';
import { Message, Chat } from '../types';

export const useSocket = () => {
  useEffect(() => {
    socketService.connect();
    
    return () => {
      socketService.disconnect();
    };
  }, []);

  const onQRCode = useCallback((callback: (qr: string) => void) => {
    socketService.onQRCode(callback);
    return () => socketService.offQRCode(callback);
  }, []);

  const onConnectionUpdate = useCallback((callback: (update: any) => void) => {
    socketService.onConnectionUpdate(callback);
    return () => socketService.offConnectionUpdate(callback);
  }, []);

  const onMessageUpsert = useCallback((callback: (message: Message) => void) => {
    socketService.onMessageUpsert(callback);
    return () => socketService.offMessageUpsert(callback);
  }, []);

  const onChatsUpdate = useCallback((callback: (chats: Chat[]) => void) => {
    socketService.onChatsUpdate(callback);
    return () => socketService.offChatsUpdate(callback);
  }, []);

  const isConnected = useCallback(() => {
    return socketService.isConnected();
  }, []);

  return {
    onQRCode,
    onConnectionUpdate,
    onMessageUpsert,
    onChatsUpdate,
    isConnected
  };
};
