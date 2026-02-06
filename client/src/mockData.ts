// Mock Data and Services for EasyMessenger

// --- API Endpoints Documentation ---
export const API_ENDPOINTS = [
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
    path: '/api/qr',
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
    path: '/api/status',
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
    path: '/api/logout',
    title: 'Logout',
    description: 'Encerra a sessão atual, apaga os dados de autenticação e reinicia o socket.',
    params: [],
    responseEx: {
      status: "success",
      message: "Sessão encerrada"
    }
  }
];

// --- Mock Chat Data ---
export const MOCK_CHATS = [
  {
    id: '1',
    name: 'Suporte Técnico',
    lastMessage: 'Obrigado pelo contato!',
    unread: 2,
    timestamp: '10:42',
    messages: [
      { 
        id: '1', 
        text: 'Olá, preciso de ajuda com a API.', 
        fromMe: false, 
        timestamp: new Date(Date.now() - 3600000), 
        status: 'read' 
      },
      { 
        id: '2', 
        text: 'Claro! Qual é a sua dúvida?', 
        fromMe: true, 
        timestamp: new Date(Date.now() - 3000000), 
        status: 'read' 
      },
      { 
        id: '3', 
        text: 'Obrigado pelo contato!', 
        fromMe: true, 
        timestamp: new Date(Date.now() - 2400000), 
        status: 'read' 
      },
    ]
  },
  {
    id: '2',
    name: 'João Silva',
    lastMessage: 'Pagamento confirmado.',
    unread: 0,
    timestamp: 'Ontem',
    messages: [
      { 
        id: '1', 
        text: 'Bom dia, o boleto foi pago.', 
        fromMe: false, 
        timestamp: new Date(Date.now() - 86400000), 
        status: 'read' 
      },
      { 
        id: '2', 
        text: 'Pagamento confirmado. Obrigado!', 
        fromMe: true, 
        timestamp: new Date(Date.now() - 86000000), 
        status: 'read' 
      }
    ]
  },
  {
    id: '3',
    name: 'Grupo Vendas',
    lastMessage: 'Meta batida pessoal! 🚀',
    unread: 5,
    timestamp: 'Ontem',
    messages: []
  },
  {
    id: '4',
    name: 'Maria Santos',
    lastMessage: 'Agendamento confirmado',
    unread: 1,
    timestamp: '14:30',
    messages: [
      { 
        id: '1', 
        text: 'Oi, gostaria de agendar uma consulta', 
        fromMe: false, 
        timestamp: new Date(Date.now() - 7200000), 
        status: 'read' 
      },
      { 
        id: '2', 
        text: 'Claro! Qual dia e horário prefere?', 
        fromMe: true, 
        timestamp: new Date(Date.now() - 7000000), 
        status: 'read' 
      },
      { 
        id: '3', 
        text: 'Terça às 15h', 
        fromMe: false, 
        timestamp: new Date(Date.now() - 6800000), 
        status: 'read' 
      },
      { 
        id: '4', 
        text: 'Agendamento confirmado', 
        fromMe: true, 
        timestamp: new Date(Date.now() - 6600000), 
        status: 'delivered' 
      }
    ]
  },
  {
    id: '5',
    name: 'Pedro Costa',
    lastMessage: 'Entrega hoje à tarde',
    unread: 0,
    timestamp: '11:15',
    messages: [
      { 
        id: '1', 
        text: 'Bom dia, meu pedido já saiu para entrega?', 
        fromMe: false, 
        timestamp: new Date(Date.now() - 10800000), 
        status: 'read' 
      },
      { 
        id: '2', 
        text: 'Sim! Entrega hoje à tarde', 
        fromMe: true, 
        timestamp: new Date(Date.now() - 10000000), 
        status: 'read' 
      }
    ]
  }
];

// --- Dashboard Metrics ---
export const DASHBOARD_METRICS = {
  messagesToday: 1245,
  activeSessions: 1,
  errorRate: 0.4,
  averageTime: 1.2,
  messageVolume: [45, 78, 55, 90, 82, 65, 95], // Last 7 days
  trends: {
    messages: { value: '+12%', up: true },
    errors: { value: '-2%', up: true }
  }
};

// --- System Status ---
export const SYSTEM_STATUS = {
  apiServer: { status: 'ONLINE', color: 'text-emerald-400' },
  postgresql: { status: 'ONLINE', color: 'text-blue-400' },
  baileysSocket: { status: 'SYNCED', color: 'text-amber-400' }
};

// --- Mock API Service ---
export class MockApiService {
  private static instance: MockApiService;
  private connectionStatus: any = { connected: false, user: null };
  private qrCode: string | null = null;

  static getInstance(): MockApiService {
    if (!MockApiService.instance) {
      MockApiService.instance = new MockApiService();
    }
    return MockApiService.instance;
  }

  // Simulate API delay
  private async delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health Check
  async getHealth(): Promise<any> {
    await this.delay(500);
    return {
      status: "ok",
      uptime: Math.random() * 5000 + 1000
    };
  }

  // Get QR Code
  async getQRCode(): Promise<{ qr: string; connected: boolean }> {
    await this.delay(800);
    const qr = this.generateMockQR();
    this.qrCode = qr;
    return { qr, connected: false };
  }

  // Get Session Status
  async getSessionStatus(): Promise<any> {
    await this.delay(300);
    return this.connectionStatus;
  }

  // Send Message
  async sendMessage(number: string, text: string): Promise<any> {
    await this.delay(1200);
    return {
      status: "success",
      message_id: this.generateMessageId(),
      timestamp: Date.now()
    };
  }

  // Logout
  async logout(): Promise<any> {
    await this.delay(800);
    this.connectionStatus = { connected: false, user: null };
    this.qrCode = null;
    return {
      status: "success",
      message: "Sessão encerrada"
    };
  }

  // Get Chats
  async getChats(): Promise<any[]> {
    await this.delay(600);
    return MOCK_CHATS;
  }

  // Get Messages for a specific chat
  async getMessages(chatId: string): Promise<any[]> {
    await this.delay(400);
    const chat = MOCK_CHATS.find(c => c.id === chatId);
    return chat ? chat.messages : [];
  }

  // Simulate connection
  async simulateConnection(): Promise<void> {
    await this.delay(2000);
    this.connectionStatus = {
      connected: true,
      user: { 
        id: "5511999999999:1@s.whatsapp.net", 
        name: "Admin",
        pictureUrl: "https://ui-avatars.com/api/?name=Admin+User&background=0f172a&color=fff"
      }
    };
    this.qrCode = null;
  }

  // Helper methods
  private generateMockQR(): string {
    return '2@jKO' + Math.random().toString(36).substring(7) + '==';
  }

  private generateMessageId(): string {
    return '3EB0' + Math.random().toString(36).substring(7).toUpperCase();
  }

  // Get current QR Code
  getCurrentQRCode(): string | null {
    return this.qrCode;
  }

  // Update connection status
  updateConnectionStatus(status: any): void {
    this.connectionStatus = status;
  }
}

// --- Mock Socket Service ---
export class MockSocketService {
  private static instance: MockSocketService;
  private listeners: Map<string, Function[]> = new Map();
  private connected: boolean = false;

  static getInstance(): MockSocketService {
    if (!MockSocketService.instance) {
      MockSocketService.instance = new MockSocketService();
    }
    return MockSocketService.instance;
  }

  // Event listeners
  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Emit events
  emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Simulate QR Code generation
  simulateQRCode(): void {
    const mockQR = '2@jKO' + Math.random().toString(36).substring(7) + '==';
    this.emit('qr_code', mockQR);
  }

  // Simulate connection update
  simulateConnectionUpdate(connected: boolean): void {
    this.connected = connected;
    this.emit('connection_update', {
      connection: connected ? 'open' : 'close',
      user: connected ? { id: "5511999999999:1@s.whatsapp.net", name: "Admin" } : null
    });
  }

  // Simulate new message
  simulateNewMessage(): void {
    const randomChat = MOCK_CHATS[Math.floor(Math.random() * MOCK_CHATS.length)];
    const newMessage = {
      id: Date.now().toString(),
      text: 'Nova mensagem de teste',
      fromMe: false,
      timestamp: new Date(),
      status: 'delivered'
    };
    
    this.emit('message_upsert', {
      ...newMessage,
      chatId: randomChat.id
    });
  }

  // Simulate chats update
  simulateChatsUpdate(): void {
    this.emit('chats_update', MOCK_CHATS);
  }

  // Connect/Disconnect
  connect(): void {
    this.simulateConnectionUpdate(true);
  }

  disconnect(): void {
    this.simulateConnectionUpdate(false);
  }
}

// --- Utility Functions ---
export const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  if (hours < 1) {
    return minutes <= 1 ? 'Agora' : `${minutes} min atrás`;
  } else if (hours < 24) {
    return `${hours}h atrás`;
  } else {
    return date.toLocaleDateString('pt-BR');
  }
};

export const formatMessageTime = (date: Date): string => {
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const generateAvatar = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f172a&color=fff&size=128`;
};

// --- Export instances ---
export const mockApiService = MockApiService.getInstance();
export const mockSocketService = MockSocketService.getInstance();
