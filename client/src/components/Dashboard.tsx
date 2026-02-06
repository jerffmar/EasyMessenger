import React from 'react';
import { Send, Smartphone, X, Loader2, Users, Settings, Check } from 'lucide-react';
import { useDashboardMetrics } from '../hooks/useMockData';

interface DashboardProps {
  connectionStatus: any;
  chats: any[];
}

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

const Dashboard: React.FC<DashboardProps> = ({ connectionStatus, chats }) => {
  const { metrics, refreshMetrics } = useDashboardMetrics();

  const systemStatus = [
    { name: 'API Server', status: 'ONLINE', color: 'text-emerald-400', icon: Settings },
    { name: 'PostgreSQL', status: 'ONLINE', color: 'text-blue-400', icon: Users },
    { name: 'Baileys Socket', status: connectionStatus.connected ? 'SYNCED' : 'DISCONNECTED', color: connectionStatus.connected ? 'text-amber-400' : 'text-rose-400', icon: Loader2 }
  ];

  const getStatusColor = (color: string) => {
    switch(color) {
      case 'text-emerald-400': return 'bg-emerald-400/10 text-emerald-400';
      case 'text-blue-400': return 'bg-blue-400/10 text-blue-400';
      case 'text-amber-400': return 'bg-amber-400/10 text-amber-400';
      case 'text-rose-400': return 'bg-rose-400/10 text-rose-400';
      default: return 'bg-slate-400/10 text-slate-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Mensagens Hoje" 
          value={metrics.messagesToday.toLocaleString()} 
          icon={Send} 
          trend={metrics.trends.messages.value} 
          trendUp={metrics.trends.messages.up} 
        />
        <MetricCard 
          title="Sessões Ativas" 
          value={metrics.activeSessions} 
          icon={Smartphone} 
        />
        <MetricCard 
          title="Erros de Envio" 
          value={`${metrics.errorRate}%`} 
          icon={X} 
          trend={metrics.trends.errors.value} 
          trendUp={metrics.trends.errors.up} 
        />
        <MetricCard 
          title="Tempo Médio" 
          value={`${metrics.averageTime.toFixed(1)}s`} 
          icon={Loader2} 
        />
      </div>

      {/* Charts and Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Message Volume Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Volume de Mensagens (Últimos 7 dias)</h3>
            <button
              onClick={refreshMetrics}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              title="Atualizar dados"
            >
              <Loader2 size={16} />
            </button>
          </div>
          <div className="flex-1 flex items-end justify-between space-x-4 px-2">
            {metrics.messageVolume.map((h, i) => (
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

        {/* System Status */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white h-96 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <h3 className="font-bold text-lg mb-1 relative z-10">Status do Sistema</h3>
          <div className="mt-8 space-y-6 relative z-10">
            {systemStatus.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Icon size={18} className={item.color} />
                    </div>
                    <span className="text-sm font-medium text-slate-300">{item.name}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(item.color)}`}>
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Chats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Conversas Recentes</h3>
          <div className="space-y-3">
            {chats.slice(0, 5).map((chat) => (
              <div key={chat.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                  {chat.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-slate-800 text-sm truncate">{chat.name || 'Unknown'}</h4>
                    <span className="text-xs text-slate-400">{chat.timestamp || 'N/A'}</span>
                  </div>
                  <p className="text-sm text-slate-500 truncate">{chat.lastMessage || 'Sem mensagens'}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="bg-emerald-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Connection Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Informações da Conexão</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Status</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${connectionStatus.connected ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                <span className={`text-sm font-medium ${connectionStatus.connected ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {connectionStatus.connected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
            
            {connectionStatus.user && (
              <>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Usuário</span>
                  <span className="text-sm font-medium text-slate-800">{connectionStatus.user.name}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">ID</span>
                  <span className="text-sm font-mono text-slate-800 truncate max-w-[200px]">
                    {connectionStatus.user.id}
                  </span>
                </div>
              </>
            )}
            
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Total de Chats</span>
              <span className="text-sm font-medium text-slate-800">{chats.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
