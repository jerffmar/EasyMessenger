declare module 'react' {
  export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(initial: T): { current: T };
  export function useCallback<T extends Function>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  
  interface FC<P = {}> {
    (props: P): any;
  }
  
  export const FC: FC;
}

declare module 'react-dom/client' {
  export function createRoot(container: Element): {
    render(element: any): void;
  };
}

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
