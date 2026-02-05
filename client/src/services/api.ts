import axios from 'axios';
import { ApiResponse, ConnectionStatus, Chat, Message } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const apiService = {
  // Health check
  async healthCheck(): Promise<any> {
    const response = await api.get('/health');
    return response.data;
  },

  // Session endpoints
  async getSessionStatus(): Promise<ConnectionStatus> {
    const response = await api.get('/api/session/status');
    return (response.data as ConnectionStatus) || { connected: false, user: null };
  },

  async logout(): Promise<ApiResponse> {
    const response = await api.post('/api/session/logout');
    return response.data;
  },

  async setWebhook(url: string | null): Promise<ApiResponse> {
    const response = await api.post('/api/session/webhook', { url });
    return response.data;
  },

  // Messages endpoints
  async sendTextMessage(number: string, text: string): Promise<ApiResponse> {
    const response = await api.post('/api/messages/text', { number, text });
    return response.data;
  },

  // Chats endpoints
  async getChats(): Promise<Chat[]> {
    const response = await api.get('/api/chats');
    return (response.data as Chat[]) || [];
  },

  async getChatMessages(chatId: string, limit: number = 50): Promise<Message[]> {
    const response = await api.get(`/api/chats/${chatId}/messages?limit=${limit}`);
    return (response.data as Message[]) || [];
  },
};
