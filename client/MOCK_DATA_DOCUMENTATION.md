# EasyMessenger - Mock Data and Functions Documentation

## Overview

Este documento descreve todos os dados mock e funções implementadas para fazer o EasyMessenger funcionar com a interface bonita similar ao exemplo fornecido.

## 📁 Estrutura de Arquivos

```
client/src/
├── mockData.ts              # Dados mock centralizados
├── hooks/
│   └── useMockData.ts       # Hooks personalizados para dados mock
├── components/
│   ├── App.tsx              # Componente principal atualizado
│   ├── LiveChat.tsx         # Componente de chat melhorado
│   ├── ApiPlayground.tsx    # Playground de API funcional
│   └── Dashboard.tsx        # Dashboard com métricas dinâmicas
```

## 🎯 Dados Mock Disponíveis

### 1. API Endpoints (`API_ENDPOINTS`)

Array com 5 endpoints da API:

- **health**: GET `/health` - Verifica status da API
- **qr**: GET `/api/qr` - Obtém QR Code para conexão
- **status**: GET `/api/status` - Status da sessão WhatsApp
- **send-text**: POST `/api/messages/text` - Envia mensagem
- **logout**: POST `/api/logout` - Encerra sessão

### 2. Mock Chats (`MOCK_CHATS`)

5 conversas de exemplo com mensagens:

1. **Suporte Técnico** - 2 não lidas, 3 mensagens
2. **João Silva** - 0 não lidas, 2 mensagens
3. **Grupo Vendas** - 5 não lidas, sem mensagens
4. **Maria Santos** - 1 não lida, 4 mensagens
5. **Pedro Costa** - 0 não lidas, 2 mensagens

### 3. Dashboard Metrics (`DASHBOARD_METRICS`)

```typescript
{
  messagesToday: 1245,
  activeSessions: 1,
  errorRate: 0.4,
  averageTime: 1.2,
  messageVolume: [45, 78, 55, 90, 82, 65, 95], // 7 dias
  trends: {
    messages: { value: '+12%', up: true },
    errors: { value: '-2%', up: true }
  }
}
```

### 4. System Status (`SYSTEM_STATUS`)

Status dos componentes do sistema:
- API Server: ONLINE
- PostgreSQL: ONLINE  
- Baileys Socket: SYNCED/DISCONNECTED

## 🛠️ Serviços Mock Implementados

### MockApiService

Serviço singleton que simula todas as chamadas de API:

#### Métodos Disponíveis:

```typescript
// Health Check
async getHealth(): Promise<{ status: string; uptime: number }>

// QR Code
async getQRCode(): Promise<{ qr: string; connected: boolean }>

// Session Status  
async getSessionStatus(): Promise<{ connected: boolean; user: any }>

// Send Message
async sendMessage(number: string, text: string): Promise<any>

// Logout
async logout(): Promise<{ status: string; message: string }>

// Get Chats
async getChats(): Promise<any[]>

// Simulate Connection
async simulateConnection(): Promise<void>
```

### MockSocketService

Serviço que simula eventos WebSocket:

#### Eventos Disponíveis:

```typescript
// QR Code generated
socket.on('qr_code', (qr: string) => {})

// Connection status updated
socket.on('connection_update', (update: any) => {})

// New message received
socket.on('message_upsert', (message: any) => {})

// Chats updated
socket.on('chats_update', (chats: any[]) => {})
```

#### Métodos de Simulação:

```typescript
// Simulate QR generation
simulateQRCode(): void

// Simulate connection change
simulateConnectionUpdate(connected: boolean): void

// Simulate new message
simulateNewMessage(): void

// Simulate chats update
simulateChatsUpdate(): void
```

## 🎣 Hooks Personalizados

### useConnectionState()

Gerencia o estado da conexão WhatsApp:

```typescript
const {
  connectionStatus,
  qrCode,
  loading,
  handleConnect,
  handleDisconnect,
  generateQR
} = useConnectionState();
```

### useChats()

Gerencia as conversas:

```typescript
const {
  chats,
  loading,
  refreshChats,
  sendMessage
} = useChats();
```

### useMockSocket()

Gerencia eventos do socket:

```typescript
const {
  events,
  simulateNewMessage,
  simulateConnectionUpdate,
  clearEvents
} = useMockSocket();
```

### useDashboardMetrics()

Gerencia métricas do dashboard:

```typescript
const {
  metrics,
  refreshMetrics
} = useDashboardMetrics();
```

## 🎨 Componentes Implementados

### 1. App.tsx - Interface Principal

- **Sidebar** fixa com navegação moderna
- **Header** com status de conexão e avatar
- **Dashboard** com métricas e gráficos
- **Device Management** com QR code animado
- **Live Chat** estilo WhatsApp
- **API Playground** interativo
- **Logs & Settings** placeholders

### 2. LiveChat.tsx - Interface de Chat

- **Lista de conversas** com busca e avatares
- **Área de mensagens** com background WhatsApp
- **Input de mensagem** com botões de ação
- **Status indicators** online/offline
- **Mock data integration** com 5 conversas

### 3. ApiPlayground.tsx - Playground API

- **Sidebar** com endpoints disponíveis
- **Documentação** detalhada de cada endpoint
- **Request builder** para testar APIs
- **Response viewer** com syntax highlighting
- **Copy functionality** para respostas
- **Mock responses** realistas

### 4. Dashboard.tsx - Painel de Controle

- **Metric cards** com trends
- **Message volume chart** interativo
- **System status panel** dinâmico
- **Recent chats list** 
- **Connection info** detalhada
- **Auto-refresh** functionality

## 🔧 Funções Utilitárias

### Formatação de Dados

```typescript
// Formata timestamp relativo
formatTimestamp(date: Date): string

// Formata hora da mensagem
formatMessageTime(date: Date): string

// Gera avatar URL
generateAvatar(name: string): string
```

## 🚀 Como Usar

### 1. Importar dados mock:

```typescript
import { 
  API_ENDPOINTS, 
  MOCK_CHATS, 
  DASHBOARD_METRICS,
  mockApiService,
  mockSocketService 
} from './mockData';
```

### 2. Usar hooks personalizados:

```typescript
import { 
  useConnectionState,
  useChats,
  useMockSocket,
  useDashboardMetrics
} from './hooks/useMockData';
```

### 3. Simular eventos:

```typescript
// Simular nova mensagem
mockSocketService.simulateNewMessage();

// Simular conexão
mockSocketService.simulateConnectionUpdate(true);

// Gerar QR code
mockApiService.getQRCode();
```

## 🎯 Funcionalidades Implementadas

### ✅ Dashboard
- [x] Métricas em tempo real
- [x] Gráfico de volume de mensagens
- [x] Status do sistema
- [x] Conversas recentes
- [x] Informações de conexão

### ✅ Gerenciamento de Dispositivos
- [x] Interface de QR code
- [x] Animação de scan
- [x] Status de conexão
- [x] Simulação de conexão

### ✅ Live Chat
- [x] Lista de conversas
- [x] Interface de mensagens
- [x] Envio de mensagens
- [x] Avatares gerados
- [x] Status online/offline

### ✅ API Playground
- [x] Documentação de endpoints
- [x] Teste de requisições
- [x] Respostas mock
- [x] Interface interativa

### ✅ Estado Global
- [x] Gerenciamento de conexão
- [x] Eventos WebSocket mock
- [x] Atualizações em tempo real
- [x] Persistência de estado

## 🔄 Fluxo de Dados

1. **Inicialização**: Carrega dados mock e estado inicial
2. **Conexão**: Simula geração de QR e conexão
3. **Eventos**: Dispara eventos WebSocket mock
4. **Atualizações**: Atualiza UI em tempo real
5. **Interação**: Permite interação com todos os componentes

## 🎨 Estilo e Design

- **Cores**: Esquema emerald/slate profissional
- **Tipografia**: Font hierarchy consistente
- **Animações**: Transições suaves e micro-interactions
- **Responsivo**: Layout adaptável
- **WhatsApp-like**: Interface familiar do chat

## 📝 Notas

- Todos os dados são mock e não se conectam à API real
- As simulações imitam o comportamento real do WhatsApp
- Os hooks facilitam o gerenciamento de estado
- Os componentes são totalmente funcionais e interativos
- O código está organizado e fácil de estender
