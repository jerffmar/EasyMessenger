import React, { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import { apiService } from './services/api';
import { ConnectionStatus, Chat, Message } from './types';
import { Smartphone, MessageSquare, Activity, Settings, LogOut, CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Components
import QRCodeDisplay from './components/QRCodeDisplay';
import Dashboard from './components/Dashboard';
import LiveChat from './components/LiveChat';
import ApiPlayground from './components/ApiPlayground';
import SettingsPanel from './components/SettingsPanel';

type TabType = 'dashboard' | 'chat' | 'api' | 'settings';

function App() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ connected: false, user: null });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(true);

  const { onQRCode, onConnectionUpdate, onMessageUpsert, onChatsUpdate } = useSocket();

  useEffect(() => {
    // Initial data load
    const loadInitialData = async () => {
      try {
        const status = await apiService.getSessionStatus();
        setConnectionStatus(status);
        
        if (status.connected) {
          const chatsData = await apiService.getChats();
          setChats(chatsData);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    // Socket event listeners
    const unsubscribeQR = onQRCode((qr: string) => {
      setQrCode(qr);
    });

    const unsubscribeConnection = onConnectionUpdate((update: any) => {
      if (update.connection === 'open') {
        setConnectionStatus({ connected: true, user: null });
        setQrCode(null);
      } else if (update.connection === 'close') {
        setConnectionStatus({ connected: false, user: null });
      }
    });

    const unsubscribeMessage = onMessageUpsert((message: Message) => {
      console.log('New message received:', message);
      // Update chat list when new message arrives
      loadChats();
    });

    const unsubscribeChats = onChatsUpdate((updatedChats: Chat[]) => {
      setChats(updatedChats);
    });

    const loadChats = async () => {
      try {
        const chatsData = await apiService.getChats();
        setChats(chatsData);
      } catch (error) {
        console.error('Failed to load chats:', error);
      }
    };

    return () => {
      unsubscribeQR();
      unsubscribeConnection();
      unsubscribeMessage();
      unsubscribeChats();
    };
  }, [onQRCode, onConnectionUpdate, onMessageUpsert, onChatsUpdate]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setConnectionStatus({ connected: false, user: null });
      setQrCode(null);
      setChats([]);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: Activity },
    { id: 'chat' as TabType, label: 'Live Chat', icon: MessageSquare },
    { id: 'api' as TabType, label: 'API Docs', icon: Smartphone },
    { id: 'settings' as TabType, label: 'Configurações', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">WhatsApp Manager</h1>
              <div className="ml-4 flex items-center space-x-2">
                {connectionStatus.connected ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-600">Conectado</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-red-600">Desconectado</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {connectionStatus.user && (
                <div className="flex items-center space-x-2">
                  {connectionStatus.user.pictureUrl && (
                    <img
                      src={connectionStatus.user.pictureUrl}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700">{connectionStatus.user.name}</span>
                </div>
              )}
              
              {connectionStatus.connected && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* QR Code Modal */}
        {qrCode && !connectionStatus.connected && (
          <div className="mb-8">
            <QRCodeDisplay qrCode={qrCode} />
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            connectionStatus={connectionStatus}
            chats={chats}
          />
        )}
        
        {activeTab === 'chat' && (
          <LiveChat 
            chats={chats}
            isConnected={connectionStatus.connected}
          />
        )}
        
        {activeTab === 'api' && (
          <ApiPlayground />
        )}
        
        {activeTab === 'settings' && (
          <SettingsPanel />
        )}
      </main>
    </div>
  );
}

export default App;
