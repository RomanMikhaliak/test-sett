import { BaseState } from "../state/BaseState";
import { EventBus } from "../eventbus/EventBus";

export class StateMachine {
  private states: Map<string, BaseState>;
  private currentState: BaseState | null;
  private eventBus?: EventBus;

  constructor(eventBus?: EventBus) {
    this.states = new Map();
    this.currentState = null;
    this.eventBus = eventBus;
  }

  setEventBus(eventBus: EventBus): void {
    this.eventBus = eventBus;
  }

  addState(state: BaseState): void {
    this.states.set(state.getName(), state);
  }

  removeState(stateName: string): void {
    this.states.delete(stateName);
  }

  async changeState(stateName: string): Promise<void> {
    if (this.currentState) {
      this.currentState.exit();
    }

    const newState = this.states.get(stateName);
    if (newState) {
      this.currentState = newState;
      const enterResult = this.currentState.enter();
      if (enterResult instanceof Promise) {
        await enterResult;
      }

      if (this.eventBus && typeof window !== "undefined") {
        this.eventBus.dispatch("resize", {
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    }
  }

  update(deltaTime: number): void {
    if (this.currentState) {
      this.currentState.update(deltaTime);
    }
  }

  getCurrentState(): BaseState | null {
    return this.currentState;
  }

  getCurrentStateName(): string | null {
    return this.currentState ? this.currentState.getName() : null;
  }
}
