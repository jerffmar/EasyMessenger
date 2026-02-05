export interface ConnectionStatus {
  connected: boolean;
  user: {
    id: string;
    name: string;
    pictureUrl?: string;
  } | null;
}

export interface Chat {
  id: string;
  name?: string;
  unreadCount: number;
  lastMessage?: string;
  timestamp: number;
  isGroup: boolean;
}

export interface Message {
  key: {
    remoteJid: string;
    id: string;
    fromMe: boolean;
  };
  message: any;
  messageTimestamp: number;
  status: 'ERROR' | 'PENDING' | 'SERVER_ACK' | 'DELIVERY_ACK' | 'READ' | 'PLAYED';
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: string;
}

export interface WebhookData {
  event: string;
  data: Message;
}
