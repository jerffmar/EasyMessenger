# Configuração de Produção - Render.com

## Variáveis de Ambiente

Para que o aplicativo funcione corretamente em produção no Render.com, você precisa configurar as seguintes variáveis de ambiente:

### 1. Variáveis de Ambiente do Backend

No painel do Render.com, vá para o seu serviço e configure:

```
NODE_ENV=production
SESSION_PATH=./auth_info
LOG_LEVEL=info
```

### 2. Variáveis de Ambiente do Frontend

O frontend agora detecta automaticamente o ambiente e usa a URL correta:

- **Desenvolvimento**: Usa `http://localhost:3001`
- **Produção**: Usa automaticamente a mesma origem do frontend (`window.location.origin`)

### Como Funciona

#### API Service
```typescript
const getApiBaseUrl = () => {
  // Se VITE_API_URL estiver definida, usa ela
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Se estiver em produção, usa a mesma origem do frontend
  if (import.meta.env.MODE === 'production') {
    return window.location.origin;
  }
  
  // Desenvolvimento fallback
  return 'http://localhost:3001';
};
```

#### Socket Service
```typescript
const getServerUrl = () => {
  // Se VITE_SERVER_URL estiver definida, usa ela
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL;
  }
  
  // Se estiver em produção, usa a mesma origem do frontend
  if (import.meta.env.MODE === 'production') {
    return window.location.origin;
  }
  
  // Desenvolvimento fallback
  return 'http://localhost:3001';
};
```

### Estados da UI

O aplicativo agora mostra estados diferentes:

1. **Conectado**: ✅ Interface verde mostrando status ativo
2. **Aguardando QR**: 🟡 Interface amarela com instruções
3. **Servidor Offline**: 🔴 Interface vermelha com mensagem de erro
4. **QR Code Ativo**: 📱 QR Code gerado com animação de scan

### Deploy no Render.com

1. **Backend**: Configure como serviço Node.js
2. **Frontend**: Configure como serviço Static Site
3. **Variáveis**: Adicione as variáveis de ambiente necessárias
4. **Build**: O build já está configurado para funcionar em produção

### Troubleshooting

Se o frontend não conseguir se conectar ao backend:

1. Verifique se ambos estão online no painel do Render
2. Confirme as variáveis de ambiente
3. Verifique os logs no painel do Render
4. O frontend automaticamente usará a URL correta em produção
