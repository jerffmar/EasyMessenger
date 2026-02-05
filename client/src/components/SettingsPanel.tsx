import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Save, Globe, Bell, Shield } from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load saved webhook URL from localStorage
    const savedUrl = localStorage.getItem('webhook_url');
    if (savedUrl) {
      setWebhookUrl(savedUrl);
    }
  }, []);

  const handleSaveWebhook = async () => {
    try {
      setSaving(true);
      await apiService.setWebhook(webhookUrl || null);
      localStorage.setItem('webhook_url', webhookUrl);
      setMessage('Webhook salvo com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erro ao salvar webhook');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Configurações</h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure as preferências da aplicação
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Webhook Configuration */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Globe className="h-5 w-5 text-blue-600" />
              <h4 className="text-base font-medium text-gray-900">Webhook URL</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Configure uma URL para receber eventos de novas mensagens em tempo real.
            </p>
            <div className="flex space-x-3">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://seu-webhook.com/whatsapp"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSaveWebhook}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Salvar</span>
                  </>
                )}
              </button>
            </div>
            {message && (
              <div className={`mt-2 text-sm ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </div>
            )}
          </div>

          {/* Notification Settings */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Bell className="h-5 w-5 text-blue-600" />
              <h4 className="text-base font-medium text-gray-900">Notificações</h4>
            </div>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Receber notificações de novas mensagens
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Notificar quando a conexão for perdida
                </span>
              </label>
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <h4 className="text-base font-medium text-gray-900">Segurança</h4>
            </div>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={false}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Exigir autenticação para acessar a API
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Limitar taxa de requisições (Rate Limiting)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Informações do Sistema</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Versão:</span>
              <span className="ml-2 text-gray-600">1.0.0</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Node.js:</span>
              <span className="ml-2 text-gray-600">&gt;=20.0.0</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Baileys:</span>
              <span className="ml-2 text-gray-600">7.0.0-rc.9</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Ambiente:</span>
              <span className="ml-2 text-gray-600">Development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
