# Sistema de Login - EasyMessenger

## 📋 Descrição

O EasyMessenger agora possui um sistema de login seguro que protege o acesso à interface web e à API.

## 🔐 Funcionalidades

### 1. Senha de Acesso
- **Tamanho**: 32 caracteres
- **Composição**: Letras maiúsculas, minúsculas e números
- **Geração**: Automática no primeiro deploy
- **Exibição**: Apenas nos logs do deploy

### 2. Autenticação Web
- **Tela de login**: Interface moderna com design responsivo
- **Sessão**: Mantida em localStorage
- **Proteção**: Todas as rotas da API são protegidas

### 3. API Key
- **Uso**: A mesma senha serve como API Key
- **Formato**: Bearer Token no header Authorization
- **Validação**: Middleware automático no servidor

## 🚀 Deploy

### 1. Primeiro Deploy
- Senha gerada automaticamente
- Exibida nos logs do servidor
- Deve ser salva imediatamente

### 2. Deploys Seguintes
- Senha mantida se `API_PASSWORD` estiver definida
- Nova senha gerada se não houver variável de ambiente

### 3. Variáveis de Ambiente
```bash
API_PASSWORD=sua_senha_aqui
```

## 🔧 Uso

### Acesso Web
1. Acesse a URL do aplicativo
2. Digite a senha de 32 caracteres
3. Clique em "Acessar"

### API Externa
```javascript
const response = await fetch('https://seu-app.onrender.com/api/session/status', {
  headers: {
    'Authorization': 'Bearer sua_senha_de_32_caracteres'
  }
});
```

## 📝 Logs de Deploy

Exemplo de log exibido no primeiro deploy:

```
============================================================
🔐 EASYMESSENGER LOGIN PASSWORD
============================================================
Password: Xk9mP2nQ5vR8wL1sT4fG7hJ3zY6b
============================================================
⚠️  SAVE THIS PASSWORD - IT WILL NOT BE SHOWN AGAIN
📝 This password is also your API Key for external services
============================================================
```

## ⚠️ Segurança

- A senha é exibida **apenas uma vez** no primeiro deploy
- Guarde-a em local seguro
- Não compartilhe a senha
- Rotas da API exigem autenticação

## 🔄 Fluxo de Autenticação

1. **Login Web** → Token salvo no localStorage
2. **Acesso API** → Token validado via middleware
3. **Logout** → Token removido do localStorage

## 🛠️ Arquivos Modificados

### Frontend
- `src/components/Login.tsx` - Tela de login
- `src/hooks/useAuth.ts` - Hook de autenticação
- `src/App.tsx` - Integração com sistema de login

### Backend
- `server/services/auth.ts` - Geração e validação de senha
- `server/routes/auth.ts` - Rotas de autenticação
- `server/server.ts` - Middleware de proteção

## 🎯 Benefícios

✅ **Segurança**: Acesso controlado por senha forte
✅ **API Key**: Mesma credencial para uso externo
✅ **Deploy**: Configuração automática
✅ **UX**: Interface moderna e intuitiva
✅ **Proteção**: Todas as rotas da API protegidas
