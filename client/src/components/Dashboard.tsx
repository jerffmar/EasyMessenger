import React from 'react';
import { ConnectionStatus, Chat } from '../types';
import { Users, MessageSquare, Send, Clock, TrendingUp } from 'lucide-react';

interface DashboardProps {
  connectionStatus: ConnectionStatus;
  chats: Chat[];
}

const Dashboard: React.FC<DashboardProps> = ({ connectionStatus, chats }) => {
  const totalChats = chats.length;
  const unreadMessages = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);
  const groupChats = chats.filter(chat => chat.isGroup).length;
  const privateChats = totalChats - groupChats;

  const recentChats = chats
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Chats</p>
              <p className="text-2xl font-semibold text-gray-900">{totalChats}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mensagens Não Lidas</p>
              <p className="text-2xl font-semibold text-gray-900">{unreadMessages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chats Privados</p>
              <p className="text-2xl font-semibold text-gray-900">{privateChats}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Grupos</p>
              <p className="text-2xl font-semibold text-gray-900">{groupChats}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Status da Conexão</h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${connectionStatus.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-900">
                {connectionStatus.connected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            
            {connectionStatus.user && (
              <div className="flex items-center space-x-3">
                {connectionStatus.user.pictureUrl && (
                  <img
                    src={connectionStatus.user.pictureUrl}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{connectionStatus.user.name}</p>
                  <p className="text-xs text-gray-500">{connectionStatus.user.id}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Chats */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Chats Recentes</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentChats.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500">
              Nenhum chat encontrado
            </div>
          ) : (
            recentChats.map((chat) => (
              <div key={chat.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        chat.isGroup ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        <Users className={`h-5 w-5 ${chat.isGroup ? 'text-purple-600' : 'text-blue-600'}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {chat.name || chat.id}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage || 'Nenhuma mensagem'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {chat.unreadCount > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {chat.unreadCount}
                      </span>
                    )}
                    <div className="text-xs text-gray-500">
                      {new Date(chat.timestamp).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
