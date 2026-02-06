import React, { useState } from 'react';
import { apiService } from '../services/api';
import { Send, Check } from 'lucide-react';

interface ApiTest {
  name: string;
  method: 'GET' | 'POST';
  endpoint: string;
  body?: any;
  description: string;
}

const ApiPlayground: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<ApiTest | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const apiTests: ApiTest[] = [
    {
      name: 'Health Check',
      method: 'GET',
      endpoint: '/health',
      description: 'Verifica o status do servidor'
    },
    {
      name: 'Status da Sessão',
      method: 'GET',
      endpoint: '/api/session/status',
      description: 'Verifica o status da conexão com WhatsApp'
    },
    {
      name: 'Listar Chats',
      method: 'GET',
      endpoint: '/api/chats',
      description: 'Lista todas as conversas'
    },
    {
      name: 'Enviar Mensagem',
      method: 'POST',
      endpoint: '/api/messages/text',
      body: {
        number: '5511999998888',
        text: 'Mensagem de teste da API'
      },
      description: 'Envia uma mensagem de texto'
    }
  ];

  const executeTest = async () => {
    if (!selectedTest) return;

    try {
      setLoading(true);
      let result;

      switch (selectedTest.method) {
        case 'GET':
          result = await fetch(selectedTest.endpoint);
          break;
        case 'POST':
          result = await fetch(selectedTest.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedTest.body),
          });
          break;
      }

      const data = await result.json();
      setResponse({
        status: result.status,
        statusText: result.statusText,
        data
      });
    } catch (error) {
      setResponse({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = JSON.stringify(response, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">API Playground</h3>
          <p className="text-sm text-gray-600 mt-1">
            Teste os endpoints da API diretamente do navegador
          </p>
        </div>

        <div className="p-6">
          {/* Test Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione um teste
            </label>
            <select
              value={selectedTest?.name || ''}
              onChange={(e) => {
                const test = apiTests.find(t => t.name === e.target.value);
                setSelectedTest(test || null);
                setResponse(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Escolha um endpoint...</option>
              {apiTests.map((test) => (
                <option key={test.name} value={test.name}>
                  {test.name}
                </option>
              ))}
            </select>
          </div>

          {/* Test Details */}
          {selectedTest && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{selectedTest.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMethodColor(selectedTest.method)}`}>
                  {selectedTest.method}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{selectedTest.description}</p>
              <code className="text-sm bg-gray-200 px-2 py-1 rounded">
                {selectedTest.endpoint}
              </code>
              
              {selectedTest.body && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Body:</p>
                  <pre className="text-xs bg-gray-200 p-2 rounded overflow-x-auto">
                    {JSON.stringify(selectedTest.body, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Execute Button */}
          <div className="mb-6">
            <button
              onClick={executeTest}
              disabled={!selectedTest || loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Executando...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Executar</span>
                </>
              )}
            </button>
          </div>

          {/* Response */}
          {response && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Resposta</h4>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  {copied ? (
                    <>
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                {response.error ? (
                  <div className="text-red-600">
                    <p className="font-medium">Error:</p>
                    <p className="text-sm">{response.error}</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        response.status >= 200 && response.status < 300
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {response.status} {response.statusText}
                      </span>
                    </div>
                    <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Documentação da API</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Endpoints Disponíveis</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="bg-gray-100 px-1 rounded">GET /health</code> - Status do servidor</li>
                <li><code className="bg-gray-100 px-1 rounded">GET /api/session/status</code> - Status da sessão WhatsApp</li>
                <li><code className="bg-gray-100 px-1 rounded">POST /api/session/logout</code> - Desconectar sessão</li>
                <li><code className="bg-gray-100 px-1 rounded">POST /api/session/webhook</code> - Configurar webhook</li>
                <li><code className="bg-gray-100 px-1 rounded">POST /api/messages/text</code> - Enviar mensagem</li>
                <li><code className="bg-gray-100 px-1 rounded">GET /api/chats</code> - Listar chats</li>
                <li><code className="bg-gray-100 px-1 rounded">GET /api/chats/:id/messages</code> - Mensagens do chat</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Eventos Socket.io</h4>
              <ul className="space-y-2 text-sm">
                <li><code className="bg-gray-100 px-1 rounded">qr_code</code> - Novo QR Code gerado</li>
                <li><code className="bg-gray-100 px-1 rounded">connection_update</code> - Atualização de conexão</li>
                <li><code className="bg-gray-100 px-1 rounded">message_upsert</code> - Nova mensagem recebida</li>
                <li><code className="bg-gray-100 px-1 rounded">chats_update</code> - Atualização dos chats</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiPlayground;
