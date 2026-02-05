declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
