import React, { useState, useEffect } from 'react';
import { Chat, Message } from '../types';
import { apiService } from '../services/api';
import { useChatMessages } from '../hooks/useRealData';
import { Send, MessageSquare, Users, Check, Settings, X, Loader2 } from 'lucide-react';

interface LiveChatProps {
  chats: Chat[];
  isConnected: boolean;
}

const LiveChat: React.FC<LiveChatProps> = ({ chats, isConnected }) => {
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  
  // Use real chats or fallback to first chat
  const displayChats = chats.length > 0 ? chats : [];
  const selectedChat = displayChats.find((c) => c.id === selectedChatId) || displayChats[0];
  
  // Get messages for selected chat using real hook
  const { messages, loading: messagesLoading } = useChatMessages(selectedChatId);

  // Auto-select first chat when available
  useEffect(() => {
    if (displayChats.length > 0 && !selectedChatId) {
      setSelectedChatId(displayChats[0].id);
    }
  }, [displayChats, selectedChatId]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !isConnected || !selectedChatId) return;
    
    try {
      await apiService.sendTextMessage(selectedChatId, inputText);
      setInputText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
      {/* Chat List */}
      <div className="w-1/3 border-r border-slate-100 flex flex-col bg-white">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Settings className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar conversa..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {displayChats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`p-4 flex items-center space-x-4 cursor-pointer border-b border-slate-50 hover:bg-slate-50 transition-colors ${selectedChatId === chat.id ? 'bg-emerald-50/50' : ''}`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-sm">
                {chat.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-slate-800 text-sm truncate">{chat.name || 'Unknown'}</h4>
                  <span className="text-xs text-slate-400">
                    {chat.timestamp ? new Date(chat.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate flex items-center">
                  {selectedChatId === chat.id && <Check size={14} className="text-blue-400 mr-1" />}
                  {chat.lastMessage || 'Nenhuma mensagem'}
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="bg-emerald-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 flex flex-col bg-[#efeae2]">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold cursor-pointer">
              {selectedChat?.name?.charAt(0) || '?'}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{selectedChat?.name || 'Selecione um chat'}</h3>
              <p className="text-xs text-slate-500">{isConnected ? 'Online agora' : 'Desconectado'}</p>
            </div>
          </div>
          <div className="flex space-x-3 text-slate-600">
            <Settings size={20} className="cursor-pointer hover:text-slate-800" />
            <X size={20} className="cursor-pointer hover:text-slate-800" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat' }}>
          {messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="animate-spin mx-auto mb-4 text-slate-300" size={48} />
                <p className="text-slate-500">Carregando mensagens...</p>
              </div>
            </div>
          ) : messages && messages.length > 0 ? (
            messages.map((msg: Message) => (
              <div key={msg.key.id} className={`flex ${msg.key.fromMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm text-sm relative ${
                  msg.key.fromMe ? 'bg-[#d9fdd3] text-slate-800' : 'bg-white text-slate-800'
                }`}>
                  <p className="mr-4">
                    {msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text || 
                     msg.message?.imageMessage?.caption || 
                     'Media message'}
                  </p>
                  <div className="flex justify-end items-center space-x-1 mt-1 opacity-70">
                    <span className="text-[10px]">
                      {new Date(msg.messageTimestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    {msg.key.fromMe && <Check size={12} className="text-blue-500" />}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">Nenhuma mensagem nesta conversa</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 flex items-center space-x-2">
          <div className="flex space-x-2 text-slate-500">
            <Settings size={24} className="cursor-pointer hover:text-slate-700" />
            <Users size={24} className="cursor-pointer hover:text-slate-700" />
          </div>
          <div className="flex-1">
            <input 
              type="text" 
              className="w-full py-2.5 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-300"
              placeholder={isConnected ? "Digite uma mensagem" : "Conecte-se para enviar mensagens"}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isConnected) {
                  handleSendMessage();
                }
              }}
              disabled={!isConnected}
            />
          </div>
          {inputText && isConnected ? (
            <button 
              onClick={handleSendMessage}
              className="bg-emerald-500 p-2.5 rounded-full text-white shadow-md hover:bg-emerald-600 transition-colors"
            >
              <Send size={20} />
            </button>
          ) : (
            <div className="text-slate-500 p-2">
              <Loader2 size={24} className="cursor-pointer hover:text-slate-700" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
