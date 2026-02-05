declare module 'qrcode' {
  export function toDataURL(text: string, options?: any): Promise<string>;
}

declare module 'axios' {
  export interface AxiosInstance {
    get<T>(url: string): Promise<{ data: T }>;
    post<T>(url: string, data?: any): Promise<{ data: T }>;
    put<T>(url: string, data?: any): Promise<{ data: T }>;
    delete<T>(url: string): Promise<{ data: T }>;
  }
  
  export function create(config?: any): AxiosInstance;
}

declare module 'socket.io-client' {
  export function io(url: string, options?: any): any;
}

declare module 'lucide-react' {
  export const X: any;
  export const Smartphone: any;
  export const Save: any;
  export const Globe: any;
  export const Bell: any;
  export const Shield: any;
  export const MessageSquare: any;
  export const Send: any;
  export const Users: any;
  export const Settings: any;
  export const LogOut: any;
  export const Loader2: any;
  export const Check: any;
}
