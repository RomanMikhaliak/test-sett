declare module 'signals' {
  export class Signal {
    add(listener: Function, listenerContext?: any, priority?: number): any;
    addOnce(listener: Function, listenerContext?: any, priority?: number): any;
    remove(listener: Function, listenerContext?: any): any;
    removeAll(): void;
    dispatch(...params: any[]): void;
  }
}
