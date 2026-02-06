declare module 'express' {
  interface Request {
    headers: any;
    body: any;
  }
  
  interface Response {
    status(code: number): Response;
    json(data: any): Response;
  }
}

declare module 'http' {}

declare module 'socket.io' {
  class Server {
    constructor(server: any, options?: any);
  }
}

declare module 'cors' {}

declare module 'dotenv' {}

declare module 'path' {}

declare module 'url' {}

declare global {
  var process: {
    env: {
      [key: string]: string | undefined;
      API_PASSWORD?: string;
      PORT?: string;
      NODE_ENV?: string;
    };
    uptime(): number;
    memoryUsage(): any;
  };
}
