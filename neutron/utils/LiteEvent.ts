export type LiteEventHandler<T> = (data: T) => void | Promise<void>;

export interface ILiteEvent<T> {
  on(handler: LiteEventHandler<T>): void;
  off(handler: LiteEventHandler<T>): void;
  offAll(): void;
  once(handler: LiteEventHandler<T>): void;
  trigger(data: T): Promise<void>;
}

export class LiteEvent<T> implements ILiteEvent<T> {
  private handlers: Array<LiteEventHandler<T>> = [];

  public on(handler: LiteEventHandler<T>): void {
    this.handlers.push(handler);
  }

  public off(handler: LiteEventHandler<T>): void {
    this.handlers = this.handlers.filter(h => h !== handler);
  }

  public offAll() {
    this.handlers = [];
  }

  public once(handler: LiteEventHandler<T>): void {
    const newHandler = (data: T) => {
      handler(data);
      this.off(newHandler);
    };
    this.on(newHandler);
  }

  public async trigger(data: T) {
    // TODO: Maybe await all call to this method?
    const handlers = this.handlers.slice(0).map(async h => h(data));
    await Promise.all(handlers);
  }

  public expose(): ILiteEvent<T> {
    return this;
  }
}
