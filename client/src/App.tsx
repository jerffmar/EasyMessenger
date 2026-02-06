import React, { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import { apiService } from './services/api';
import { ConnectionStatus, Chat, Message } from './types';
import { 
  MessageSquare, 
  Smartphone, 
  Send, 
  Settings, 
  LogOut, 
  Check, 
  X, 
  Loader2,
  Users
} from 'lucide-react';

// Import mock data and services
import { 
  API_ENDPOINTS, 
  DASHBOARD_METRICS, 
  SYSTEM_STATUS, 
  mockApiService, 
  mockSocketService,
  formatTimestamp,
  generateAvatar
} from './mockData';

// Components
import QRCodeDisplay from './components/QRCodeDisplay';
import Dashboard from './components/Dashboard';
import LiveChat from './components/LiveChat';
import ApiPlayground from './components/ApiPlayground';
import SettingsPanel from './components/SettingsPanel';

type TabType = 'dashboard' | 'devices' | 'chat' | 'api' | 'logs' | 'settings';

// --- Components ---
const SidebarItem = ({ icon: Icon, label, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
    {badge && (
      <span className="ml-auto bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

const MetricCard = ({ title, value, icon: Icon, trend, trendUp }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex items-center justify-between mb-4">
      <div className="bg-slate-50 p-3 rounded-lg text-slate-700">
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

function App() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ connected: false, user: null });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(true);
  const [qrProgress, setQrProgress] = useState(100);

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
      setConnectionStatus({
        connected: update.connection === 'open',
        user: update.user || null
      });
    });

    const unsubscribeMessage = onMessageUpsert((message: any) => {
      // Handle new messages
      console.log('New message:', message);
    });

    const unsubscribeChats = onChatsUpdate((chatsUpdate: any) => {
      // Handle chats update
      console.log('Chats updated:', chatsUpdate);
    });

    return () => {
      unsubscribeQR();
      unsubscribeConnection();
      unsubscribeMessage();
      unsubscribeChats();
    };
  }, [onQRCode, onConnectionUpdate, onMessageUpsert, onChatsUpdate]);

  // Mock QR Progress
  useEffect(() => {
    if (activeTab === 'devices' && !connectionStatus.connected) {
      const interval = setInterval(() => {
        setQrProgress(prev => (prev > 0 ? prev - 2 : 100));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [activeTab, connectionStatus.connected]);

  const handleDisconnect = async () => {
    try {
      await apiService.logout();
      setConnectionStatus({ connected: false, user: null });
      setQrCode(null);
      setChats([]);
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const handleConnect = () => {
    // Simulate connection
    setConnectionStatus({ connected: true, user: { id: "5511999999999:1@s.whatsapp.net", name: "Admin" } });
    setQrCode(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC] items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="animate-spin text-emerald-500" size={24} />
          <span className="text-slate-600">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 fixed h-full z-20 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <MessageSquare className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-slate-900">Baileys API</h1>
            <p className="text-xs text-slate-400 font-medium">Manager v1.0.4</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-2 mt-4">Menu Principal</div>
          <SidebarItem 
            icon={MessageSquare} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={Smartphone} 
            label="Dispositivos & QR" 
            active={activeTab === 'devices'} 
            onClick={() => setActiveTab('devices')} 
            badge={connectionStatus.connected ? undefined : "Ação Necessária"}
          />
          <SidebarItem 
            icon={Users} 
            label="Live Chat" 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
          />
          
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-2 mt-8">Desenvolvedor</div>
          <SidebarItem 
            icon={MessageSquare} 
            label="Docs & API" 
            active={activeTab === 'api'} 
            onClick={() => setActiveTab('api')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Logs & Webhooks" 
            active={activeTab === 'logs'} 
            onClick={() => setActiveTab('logs')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Configurações" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleDisconnect}
            className="flex items-center space-x-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-3 rounded-xl w-full transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{
              activeTab === 'dashboard' ? 'Visão Geral' :
              activeTab === 'devices' ? 'Gerenciar Conexão' :
              activeTab === 'chat' ? 'Atendimento' :
              activeTab === 'api' ? 'Documentação da API' : 
              activeTab === 'logs' ? 'Logs & Webhooks' :
              'Configurações'
            }</h2>
            <p className="text-slate-500 mt-1">Bem-vindo ao painel de controle do WhatsApp.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center space-x-2 border ${
              connectionStatus.connected 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              <span className={`w-2 h-2 rounded-full ${connectionStatus.connected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
              <span>{connectionStatus.connected ? 'Conectado via WebSocket' : 'Aguardando Conexão'}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=0f172a&color=fff" />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Mensagens Hoje" value={DASHBOARD_METRICS.messagesToday.toLocaleString()} icon={Send} trend={DASHBOARD_METRICS.trends.messages.value} trendUp={DASHBOARD_METRICS.trends.messages.up} />
              <MetricCard title="Sessões Ativas" value={DASHBOARD_METRICS.activeSessions} icon={Smartphone} />
              <MetricCard title="Erros de Envio" value={`${DASHBOARD_METRICS.errorRate}%`} icon={X} trend={DASHBOARD_METRICS.trends.errors.value} trendUp={DASHBOARD_METRICS.trends.errors.up} />
              <MetricCard title="Tempo Médio" value={`${DASHBOARD_METRICS.averageTime}s`} icon={Loader2} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96 flex flex-col">
                <h3 className="font-bold text-slate-800 mb-6">Volume de Mensagens (Últimos 7 dias)</h3>
                <div className="flex-1 flex items-end justify-between space-x-4 px-2">
                  {DASHBOARD_METRICS.messageVolume.map((h, i) => (
                    <div key={i} className="flex-1 bg-emerald-50 rounded-t-lg relative group">
                      <div 
                        className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg transition-all duration-500 group-hover:bg-emerald-600"
                        style={{ height: `${h}%` }}
                      ></div>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded">
                        {h * 10} msgs
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium">
                  <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sab</span><span>Dom</span>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 text-white h-96 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <h3 className="font-bold text-lg mb-1 relative z-10">Status do Sistema</h3>
                <div className="mt-8 space-y-6 relative z-10">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/5 rounded-lg"><Settings size={18} className="text-emerald-400" /></div>
                      <span className="text-sm font-medium text-slate-300">API Server</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${SYSTEM_STATUS.apiServer.color === 'text-emerald-400' ? 'text-emerald-400 bg-emerald-400/10' : SYSTEM_STATUS.apiServer.color === 'text-blue-400' ? 'text-blue-400 bg-blue-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                      {SYSTEM_STATUS.apiServer.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/5 rounded-lg"><Users size={18} className="text-blue-400" /></div>
                      <span className="text-sm font-medium text-slate-300">PostgreSQL</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${SYSTEM_STATUS.postgresql.color === 'text-emerald-400' ? 'text-emerald-400 bg-emerald-400/10' : SYSTEM_STATUS.postgresql.color === 'text-blue-400' ? 'text-blue-400 bg-blue-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                      {SYSTEM_STATUS.postgresql.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/5 rounded-lg"><Loader2 size={18} className="text-amber-400" /></div>
                      <span className="text-sm font-medium text-slate-300">Baileys Socket</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${SYSTEM_STATUS.baileysSocket.color === 'text-emerald-400' ? 'text-emerald-400 bg-emerald-400/10' : SYSTEM_STATUS.baileysSocket.color === 'text-blue-400' ? 'text-blue-400 bg-blue-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                      {SYSTEM_STATUS.baileysSocket.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <h3 className="text-2xl font-bold text-white relative z-10 mb-2">Conectar Dispositivo</h3>
                <p className="text-slate-400 relative z-10">Abra o WhatsApp no seu celular e escaneie o código abaixo</p>
              </div>
              <div className="p-12 flex flex-col items-center justify-center bg-white min-h-[400px]">
                {connectionStatus.connected ? (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="text-emerald-500" size={48} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Tudo pronto!</h4>
                    <p className="text-slate-500 mb-8">O Baileys está conectado e sincronizando mensagens.</p>
                    <button 
                      onClick={handleDisconnect}
                      className="text-rose-500 hover:bg-rose-50 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Desconectar Sessão
                    </button>
                  </div>
                ) : (
                  <div className="relative group cursor-pointer" onClick={handleConnect}>
                    <div className="w-64 h-64 border-2 border-slate-100 rounded-2xl p-4 bg-white shadow-sm relative">
                      {qrCode ? (
                        <QRCodeDisplay qrCode={qrCode} />
                      ) : (
                        <div className="w-full h-full bg-slate-900 pattern-dots opacity-80 rounded-lg flex items-center justify-center">
                          <Smartphone className="text-white animate-pulse" size={32} />
                        </div>
                      )}
                      
                      {/* Scan Line */}
                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-scan"></div>
                    </div>
                    <div className="mt-8 flex items-center space-x-2 text-slate-400 text-sm">
                      <Loader2 size={14} className="animate-spin" />
                      <span>Atualizando em {Math.ceil(qrProgress / 10)}s</span>
                    </div>
                    {/* Hover Hint */}
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                      <span className="font-bold text-slate-900">Clique para Simular Conexão</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center space-x-3">
                <div className="bg-slate-100 p-2 rounded-lg"><Settings size={18} className="text-slate-600" /></div>
                <div>
                  <div className="text-sm font-bold text-slate-700">Menu</div>
                  <div className="text-xs text-slate-400">No Android/iOS</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center space-x-3">
                <div className="bg-slate-100 p-2 rounded-lg"><Smartphone size={18} className="text-slate-600" /></div>
                <div>
                  <div className="text-sm font-bold text-slate-700">Aparelhos</div>
                  <div className="text-xs text-slate-400">Conectar Aparelho</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center space-x-3">
                <div className="bg-slate-100 p-2 rounded-lg"><Loader2 size={18} className="text-slate-600" /></div>
                <div>
                  <div className="text-sm font-bold text-slate-700">Escaneie</div>
                  <div className="text-xs text-slate-400">Aponte a câmera</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && <LiveChat chats={chats} isConnected={connectionStatus.connected} />}
        {activeTab === 'api' && <ApiPlayground />}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Logs & Webhooks</h3>
            <div className="text-slate-500 text-center py-12">
              <Settings size={48} className="mx-auto mb-4 text-slate-300" />
              <p>Funcionalidade de logs em desenvolvimento</p>
            </div>
          </div>
        )}
        {activeTab === 'settings' && <SettingsPanel />}

      </main>

      <style>{`
        @keyframes scan {
          0% { top: 1rem; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: calc(100% - 1rem); opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .pattern-dots {
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 10px 10px;
        }
      `}</style>
    </div>
  );
}

export default App;
