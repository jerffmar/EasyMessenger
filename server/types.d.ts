declare module 'express' {
  interface Request {
    headers: any;
    body: any;
    params: any;
    query: any;
  }
  
  interface Response {
    status(code: number): Response;
    json(data: any): Response;
    sendFile(path: string): void;
  }
  
  interface Express {
    Router(): any;
    json(): any;
    urlencoded(options?: any): any;
    static(path: string): any;
  }
  
  const e: Express;
  export = e;
  
  namespace Express {
    interface Request {
      headers: any;
      body: any;
      params: any;
      query: any;
    }
    
    interface Response {
      status(code: number): Response;
      json(data: any): Response;
      sendFile(path: string): void;
    }
  }
}

declare module 'http' {
  function createServer(app?: any): any;
  interface Server {
    listen(port: number, callback?: () => void): void;
    on(event: string, callback: (socket: any) => void): void;
  }
}

declare module 'socket.io' {
  class Server {
    constructor(server: any, options?: any);
    on(event: string, callback: (socket: any) => void): void;
  }
}


declare module 'cors' {
  function cors(options?: any): any;
  export = cors;
}

declare module 'events' {
  class EventEmitter {
    on(event: string, callback: (data: any) => void): void;
    emit(event: string, data?: any): void;
  }
  export = EventEmitter;
}

declare module 'dotenv' {
  export function config(): void;
}

declare module 'path' {
  function join(...paths: string[]): string;
}

declare module 'url' {
  function fileURLToPath(url: string): string;
}

declare module 'process' {
  var env: {
    [key: string]: string | undefined;
    API_PASSWORD?: string;
    PORT?: string;
    NODE_ENV?: string;
    SESSION_PATH?: string;
    LOG_LEVEL?: string;
  };
  function uptime(): number;
  function memoryUsage(): any;
}

declare global {
  var process: {
    env: {
      [key: string]: string | undefined;
      API_PASSWORD?: string;
      PORT?: string;
      NODE_ENV?: string;
      SESSION_PATH?: string;
      LOG_LEVEL?: string;
    };
    uptime(): number;
    memoryUsage(): any;
  };
  
  var console: {
    log(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
  };
  
  var setTimeout: (callback: () => void, delay: number) => void;
  var fetch: (url: string, options?: any) => Promise<any>;
}
