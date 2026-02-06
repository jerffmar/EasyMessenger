import React, { useState, useEffect } from 'react';
import { Send, Check, Settings, X, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

// Define endpoints locally since we removed mockData
const API_ENDPOINTS = [
  {
    id: 'health',
    method: 'GET',
    path: '/health',
    title: 'Health Check',
    description: 'Verifica se a API está online e retorna o tempo de atividade.',
    params: [],
    responseEx: {
      status: "ok",
      uptime: 1245.5
    }
  },
  {
    id: 'qr',
    method: 'GET',
    path: '/api/session/qr',
    title: 'Obter QR Code',
    description: 'Retorna a string do QR Code para autenticação. Use uma lib de QR para renderizar.',
    params: [],
    responseEx: {
      qr: "2@jKO...==",
      connected: false
    }
  },
  {
    id: 'status',
    method: 'GET',
    path: '/api/session/status',
    title: 'Status da Sessão',
    description: 'Retorna o estado atual da conexão do WhatsApp e dados do usuário.',
    params: [],
    responseEx: {
      connected: true,
      user: { id: "5511999999999:1@s.whatsapp.net", name: "Admin" },
      device: "Ativo"
    }
  },
  {
    id: 'send-text',
    method: 'POST',
    path: '/api/messages/text',
    title: 'Enviar Texto',
    description: 'Envia uma mensagem de texto simples para um número especificado.',
    params: [
      { name: 'number', type: 'string', required: true, desc: 'Número com DDI e DDD (ex: 5511999999999)' },
      { name: 'text', type: 'string', required: true, desc: 'Conteúdo da mensagem' }
    ],
    bodyEx: {
      number: "5511999999999",
      text: "Olá! Mensagem enviada via API."
    },
    responseEx: {
      status: "success",
      message_id: "3EB0...",
      timestamp: 1678900000
    }
  },
  {
    id: 'logout',
    method: 'POST',
    path: '/api/session/logout',
    title: 'Logout',
    description: 'Encerra a sessão atual, apaga os dados de autenticação e reinicia o socket.',
    params: [],
    responseEx: {
      status: "success",
      message: "Sessão encerrada"
    }
  }
];

const ApiPlayground: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Reset inputs when endpoint changes
    setRequestBody(selectedEndpoint.bodyEx ? JSON.stringify(selectedEndpoint.bodyEx, null, 2) : '');
    setResponse(null);
  }, [selectedEndpoint]);

  const handleSimulateRequest = async () => {
    setLoading(true);
    try {
      let apiResponse;
      switch (selectedEndpoint.id) {
        case 'health':
          apiResponse = await apiService.healthCheck();
          break;
        case 'qr':
          apiResponse = await apiService.getQRCode();
          break;
        case 'status':
          apiResponse = await apiService.getSessionStatus();
          break;
        case 'send-text':
          const body = JSON.parse(requestBody);
          apiResponse = await apiService.sendTextMessage(body.number, body.text);
          break;
        case 'logout':
          apiResponse = await apiService.logout();
          break;
        default:
          apiResponse = { error: 'Endpoint not implemented' };
      }
      
      setResponse(apiResponse);
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-6">API Endpoints</h3>
          <div className="space-y-2">
            {API_ENDPOINTS.map((endpoint) => (
              <button
                key={endpoint.id}
                onClick={() => setSelectedEndpoint(endpoint)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedEndpoint.id === endpoint.id
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                    {endpoint.method}
                  </span>
                  <span className="text-xs text-slate-500">{endpoint.path}</span>
                </div>
                <h4 className="font-semibold text-slate-800 mb-1">{endpoint.title}</h4>
                <p className="text-sm text-slate-600">{endpoint.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 mb-2">{selectedEndpoint.title}</h3>
            <p className="text-slate-600 mb-4">{selectedEndpoint.description}</p>
            
            {/* Parameters */}
            {selectedEndpoint.params.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-slate-700 mb-3">Parâmetros:</h4>
                <div className="space-y-2">
                  {selectedEndpoint.params.map((param) => (
                    <div key={param.name} className="flex items-center space-x-2 text-sm">
                      <span className={`font-mono px-2 py-1 rounded ${
                        param.required ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {param.name}
                      </span>
                      <span className="text-slate-600">{param.desc}</span>
                      <span className="text-xs text-slate-500">({param.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body */}
            {selectedEndpoint.bodyEx && (
              <div className="mb-6">
                <h4 className="font-semibold text-slate-700 mb-3">Corpo da Requisição:</h4>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full h-32 p-3 border border-slate-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Insira o corpo da requisição em formato JSON"
                />
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSimulateRequest}
              disabled={loading || (selectedEndpoint.bodyEx && !requestBody.trim())}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {loading ? 'Enviando...' : 'Enviar Requisição'}
            </button>
          </div>

          {/* Response */}
          {response && (
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-700">Resposta:</h4>
                <button
                  onClick={handleCopyResponse}
                  className="text-slate-500 hover:text-slate-700 flex items-center space-x-2 text-sm"
                >
                  {copied ? <Check size={14} /> : <Settings size={14} />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  <code>{JSON.stringify(response, null, 2)}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiPlayground;
