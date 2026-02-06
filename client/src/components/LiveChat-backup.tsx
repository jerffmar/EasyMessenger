import React, { useState } from 'react';
import { Chat, Message } from '../types';
import { apiService } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { Send, MessageSquare, Users } from 'lucide-react';

interface LiveChatProps {
  chats: Chat[];
  isConnected: boolean;
}

const LiveChat: React.FC<LiveChatProps> = ({ chats, isConnected }) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { onMessageUpsert } = useSocket();

  React.useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
    }
  }, [selectedChat]);

  React.useEffect(() => {
    const unsubscribe = onMessageUpsert((message: Message) => {
      if (selectedChat && message.key.remoteJid === selectedChat.id) {
        setMessages((prev: Message[]) => [...prev, message]);
      }
    });

    return unsubscribe;
  }, [selectedChat, onMessageUpsert]);

  const loadMessages = async (chatId: string) => {
    try {
      setLoading(true);
      const chatMessages = await apiService.getChatMessages(chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    try {
      const phoneNumber = selectedChat.id.replace('@s.whatsapp.net', '').replace('@g.us', '');
      await apiService.sendTextMessage(phoneNumber, messageInput);
      setMessageInput('');
      // Optimistically add message to UI
      const optimisticMessage: Message = {
        key: {
          remoteJid: selectedChat.id,
          id: Date.now().toString(),
          fromMe: true
        },
        message: { conversation: messageInput },
        messageTimestamp: Date.now(),
        status: 'PENDING'
      };
      setMessages((prev: Message[]) => [...prev, optimisticMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatMessage = (message: Message) => {
    if (message.message?.conversation) {
      return message.message.conversation;
    }
    if (message.message?.extendedTextMessage?.text) {
      return message.message.extendedTextMessage.text;
    }
    return 'Media message';
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">WhatsApp Desconectado</h3>
        <p className="text-gray-600">Conecte-se ao WhatsApp para usar o chat ao vivo.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow h-[600px] flex">
      {/* Chat List */}
      <div className="w-80 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Chats</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                selectedChat?.id === chat.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  chat.isGroup ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  <Users className={`h-5 w-5 ${chat.isGroup ? 'text-purple-600' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.name || chat.id}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage || 'Nenhuma mensagem'}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedChat.isGroup ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  <Users className={`h-4 w-4 ${selectedChat.isGroup ? 'text-purple-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedChat.name || selectedChat.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedChat.isGroup ? 'Grupo' : 'Chat Privado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="text-center text-gray-500">Carregando mensagens...</div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={`${message.key.id}-${index}`}
                    className={`flex ${message.key.fromMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.key.fromMe
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{formatMessage(message)}</p>
                      <p className={`text-xs mt-1 ${
                        message.key.fromMe ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.messageTimestamp * 1000).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione um Chat</h3>
              <p className="text-gray-600">Escolha um chat da lista para começar a conversar.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChat;
