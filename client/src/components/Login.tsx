import React, { useState } from 'react';
import { Shield, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (password: string) => void;
  error?: string;
  isLoading?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, error, isLoading = false }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (password.trim()) {
      onLogin(password.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">EasyMessenger</h1>
          <p className="text-slate-300">Gerenciador de WhatsApp</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha de 32 caracteres"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Insira a senha de 32 caracteres fornecida no deploy
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <Shield size={20} />
                  <span>Acessar</span>
                </>
              )}
            </button>
          </form>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-blue-200 text-sm">
              <strong>Como obter a senha:</strong>
            </p>
            <ul className="mt-2 text-xs text-blue-300 space-y-1">
              <li>• Verifique os logs do deploy no painel</li>
              <li>• A senha tem 32 caracteres alfanuméricos</li>
              <li>• Esta senha também serve como API Key</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            EasyMessenger © 2024 - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
