import axios from 'axios';
import { ApiResponse, ConnectionStatus, Chat, Message } from '../types';

// Auto-detect API URL based on environment
const getApiBaseUrl = () => {
  // Check if VITE_API_URL is set (for production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're in production (deployed)
  if (import.meta.env.MODE === 'production') {
    // In production, use the same origin as the frontend
    return window.location.origin;
  }
  
  // Development fallback
  return 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

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
  async connect(): Promise<ApiResponse> {
    const response = await api.post('/api/session/connect');
    return response.data;
  },

  async getSessionStatus(): Promise<ConnectionStatus> {
    const response = await api.get('/api/session/status');
    return (response.data as ConnectionStatus) || { connected: false, user: null };
  },

  async getQRCode(): Promise<{ qr: string; connected: boolean }> {
    const response = await api.get('/api/session/qr');
    return response.data as { qr: string; connected: boolean };
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
