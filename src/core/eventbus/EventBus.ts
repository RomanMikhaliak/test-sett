import { Signal } from 'signals';

export class EventBus {
  private signals: Map<string, Signal>;
  private static instance: EventBus;

  private constructor() {
    this.signals = new Map();
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  getSignal(eventName: string): Signal {
    if (!this.signals.has(eventName)) {
      this.signals.set(eventName, new Signal());
    }
    return this.signals.get(eventName)!;
  }

  dispatch(eventName: string, ...args: any[]): void {
    const signal = this.getSignal(eventName);
    signal.dispatch(...args);
  }

  add(eventName: string, callback: (...args: any[]) => void): void {
    const signal = this.getSignal(eventName);
    signal.add(callback);
  }

  addOnce(eventName: string, callback: (...args: any[]) => void): void {
    const signal = this.getSignal(eventName);
    signal.addOnce(callback);
  }

  remove(eventName: string, callback: (...args: any[]) => void): void {
    const signal = this.getSignal(eventName);
    signal.remove(callback);
  }

  removeAll(eventName?: string): void {
    if (eventName) {
      const signal = this.signals.get(eventName);
      if (signal) {
        signal.removeAll();
      }
    } else {
      this.signals.forEach(signal => signal.removeAll());
      this.signals.clear();
    }
  }

  has(eventName: string): boolean {
    return this.signals.has(eventName);
  }
}
