import React, { useState, useEffect } from 'react';
import { Send, Check, Settings, X, Loader2 } from 'lucide-react';

// Import mock data
import { API_ENDPOINTS, mockApiService } from '../mockData';

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response based on endpoint
      let mockResponse;
      switch (selectedEndpoint.id) {
        case 'health':
          mockResponse = await mockApiService.getHealth();
          break;
        case 'qr':
          mockResponse = await mockApiService.getQRCode();
          break;
        case 'status':
          mockResponse = await mockApiService.getSessionStatus();
          break;
        case 'send-text':
          const body = JSON.parse(requestBody);
          mockResponse = await mockApiService.sendMessage(body.number, body.text);
          break;
        case 'logout':
          mockResponse = await mockApiService.logout();
          break;
        default:
          mockResponse = selectedEndpoint.responseEx;
      }
      
      setResponse(mockResponse);
    } catch (error) {
      setResponse({ error: 'Failed to execute request' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodColor = (method: string) => {
    switch(method) {
      case 'GET': return 'bg-blue-100 text-blue-700';
      case 'POST': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar List */}
      <div className="w-1/4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 flex items-center">
          <Settings size={18} className="mr-2" />
          Endpoints
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {API_ENDPOINTS.map(ep => (
            <button
              key={ep.id}
              onClick={() => setSelectedEndpoint(ep)}
              className={`w-full text-left px-3 py-3 rounded-lg text-sm flex items-center group transition-colors ${
                selectedEndpoint.id === ep.id ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`}
            >
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded mr-2 w-12 text-center ${getMethodColor(ep.method)}`}>
                {ep.method}
              </span>
              <span className={`font-medium truncate ${selectedEndpoint.id === ep.id ? 'text-slate-900' : 'text-slate-600'}`}>
                {ep.title}
              </span>
              {selectedEndpoint.id === ep.id && (
                <Check size={14} className="ml-auto text-emerald-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Documentation Area */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
        {/* Header & Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-4">
            <span className={`text-sm font-bold px-3 py-1 rounded-md ${getMethodColor(selectedEndpoint.method)}`}>
              {selectedEndpoint.method}
            </span>
            <h2 className="text-xl font-bold text-slate-800 font-mono">{selectedEndpoint.path}</h2>
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed">
            {selectedEndpoint.description}
          </p>

          {/* Parameters */}
          {selectedEndpoint.params.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Parâmetros (Body)</h3>
              <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Nome</th>
                      <th className="px-4 py-3 font-medium">Tipo</th>
                      <th className="px-4 py-3 font-medium">Descrição</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedEndpoint.params.map((param: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-mono text-emerald-600">
                          {param.name} {param.required && <span className="text-rose-500">*</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{param.type}</td>
                        <td className="px-4 py-3 text-slate-700">{param.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 flex items-center">
                <Loader2 size={18} className="mr-2 text-slate-400" />
                Requisição
              </h3>
              <button 
                onClick={handleSimulateRequest}
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-1" size={12} />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={12} className="mr-1" />
                    Executar
                  </>
                )}
              </button>
            </div>
            
            {selectedEndpoint.method === 'POST' ? (
              <div className="relative flex-1">
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full h-64 font-mono text-xs bg-slate-900 text-emerald-400 p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  spellCheck={false}
                  placeholder={selectedEndpoint.bodyEx ? JSON.stringify(selectedEndpoint.bodyEx, null, 2) : '{}'}
                />
                <span className="absolute top-2 right-2 text-[10px] text-slate-500 font-mono">JSON</span>
              </div>
            ) : (
              <div className="flex-1 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 text-sm border border-dashed border-slate-200">
                Nenhum corpo necessário para requisições GET
              </div>
            )}
          </div>

          {/* Response */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 flex flex-col text-slate-300">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center">
                <Settings size={18} className="mr-2 text-emerald-500" />
                Resposta
              </h3>
              {response && (
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                    200 OK
                  </span>
                  <button
                    onClick={handleCopyResponse}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Copiar resposta"
                  >
                    {copied ? <Check size={14} /> : <Send size={14} />}
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-auto font-mono text-xs relative">
              {response ? (
                <pre className="text-emerald-300 leading-relaxed">
                  {JSON.stringify(response, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 italic">
                  Aguardando execução...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiPlayground;
