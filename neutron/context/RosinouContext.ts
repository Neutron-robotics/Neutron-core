import { ConnectionContext } from "./ConnectionContext";
import {
  Ros,
  Topic,
  Service,
  Message,
  ServiceRequest,
  ServiceResponse,
} from "roslib";
import { TopicSettings } from "../interfaces/ros";
import {
  IFrameResult,
  IFrameResultLoop,
  IRosFrameExecutor,
  IRosFrameExecutorPeriodic,
} from "../interfaces/frames";
import { LiteEvent, LiteEventHandler } from "../utils/LiteEvent";

interface IRosContextConfiguration {
  host: string;
  port: number;
}

class RosinouContext extends ConnectionContext {
  private ros: Ros;

  private handlers: Map<string, LiteEventHandler<Message>[]>;

  public override get isConnected(): boolean {
    return this.ros.isConnected;
  }

  constructor(config: IRosContextConfiguration) {
    super("rosinou", config);
    this.ros = new Ros({});
    this.handlers = new Map<string, LiteEventHandler<Message>[]>();
  }

  public override connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.ros.on("connection", () => {
        console.log("Connected to websocket server.");
        resolve(true);
      });

      this.ros.on("error", (error) => {
        console.log("Error connecting to websocket server: ", error);
        resolve(false);
      });

      this.ros.on("close", () => {
        console.log("Connection to websocket server closed.");
      });

      this.ros.connect(`ws://${this.hostname}:${this.port}`);
    });
  }

  public override disconnect(): Promise<boolean> {
    this.ros.close();
    return Promise.resolve(true);
  }

  public request(executor: IRosFrameExecutor): Promise<IFrameResult> {
    return new Promise((resolve, reject) => {
      const onSuccess = (result: ServiceResponse) => {
        resolve({
          success: true,
          result: result,
        });
      };
      const onError = (error: any) => {
        reject(error);
      };

      const { methodType, payload, format } = executor;
      const service = new Service({
        ros: this.ros,
        name: methodType,
        serviceType: format,
      });
      const serviceRequest = new ServiceRequest(payload.data);
      service.callService(serviceRequest, onSuccess, onError);
    });
  }

  public override send(executor: IRosFrameExecutor): Promise<IFrameResult> {
    const { methodType, payload, format } = executor;
    const topicSettings: TopicSettings = {
      topic: methodType,
      messageType: format,
    };
    const topicInstance: Topic<Message> = this.getTopic(topicSettings);
    const message = new Message(payload.data);
    topicInstance.publish(message);
    topicInstance.unadvertise();
    return Promise.resolve({
      success: true,
      result: null,
    });
  }

  public override sendLoop(
    executor: IRosFrameExecutorPeriodic
  ): Promise<IFrameResultLoop> {
    const { methodType, payload, format, period } = executor;
    const topicSettings: TopicSettings = {
      topic: methodType,
      messageType: format,
    };
    const onSent = new LiteEvent<IFrameResult>();
    const topicInstance = this.getTopic(topicSettings);
    const message = new Message(payload.data);
    const interval = setInterval(() => {
      topicInstance.publish(message);
      onSent.trigger({
        success: true,
        result: null,
      });
    }, (1 / period) * 1000);
    const stop = () => {
      clearInterval(interval);
      topicInstance.unadvertise();
    };
    return Promise.resolve({
      success: true,
      result: null,
      event: onSent,
      stop: stop,
    });
  }

  public override on<T>(
    executor: IRosFrameExecutor,
    handler: LiteEventHandler<T>
  ): void {
    const { methodType, format } = executor;
    const topicSettings: TopicSettings = {
      topic: methodType,
      messageType: format,
    };
    this.addHandler(methodType, handler);
    const topicInstance = this.getTopic(topicSettings);
    topicInstance.subscribe((message: Message) => {
      this.triggerHandlers(methodType, message);
    });
  }

  public override off<T>(
    executor: IRosFrameExecutor,
    handler?: LiteEventHandler<T>
  ): void {
    const { methodType, payload } = executor;
    const remainingHandlersCount = this.removeHandler(methodType, handler);
    if (remainingHandlersCount === 0) {
      const topicSettings: TopicSettings = {
        topic: methodType,
        messageType: payload.format,
      };
      const topicInstance = this.getTopic(topicSettings);
      topicInstance.unsubscribe(handler);
    }
  }

  public override removeAllListeners(): void {
    const removeTopicList = (list: { topics: string[]; types: string[] }) => {
      const { topics, types } = list;
      topics.forEach((topic, index) => {
        const topicSettings: TopicSettings = {
          topic: topic,
          messageType: types[index],
        };
        const topicInstance = this.getTopic(topicSettings);
        topicInstance.unsubscribe();
      });
    };
    const handleError = (error: any) => {
      console.log("Error getting topics: ", error);
    };
    this.ros.getTopics(removeTopicList, handleError);
  }

  public override execute(executor: IRosFrameExecutor): Promise<any> {
    switch (executor.method) {
      case "request":
        return this.request(executor);
      case "send":
        return this.send(executor);
      case "sendLoop":
        return this.sendLoop(executor as IRosFrameExecutorPeriodic);
      default:
        return Promise.reject("Unknown executor type");
    }
  }

  private getTopic(settings: TopicSettings): Topic {
    const options = {
      ros: this.ros,
      name: settings.topic,
      messageType: settings.messageType,
      throttle_rate: settings.throttleRate || 10,
      latch: settings.latch || false,
      queue_length: settings.queueLength || 1,
      queue_size: settings.queueSize || 10,
    };
    return new Topic(options);
  }

  private addHandler(topic: string, handler: LiteEventHandler<Message>): void {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, []);
    }
    this.handlers.get(topic).push(handler);
  }

  private triggerHandlers(topic: string, message: Message): void {
    this.handlers.get(topic).forEach((handler) => {
      handler(message);
    });
  }

  private removeHandler(
    topic: string,
    handler: LiteEventHandler<Message>
  ): number {
    if (!this.handlers.has(topic)) {
      return;
    }
    const handlers = this.handlers.get(topic);
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
    if (handlers.length === 0) {
      this.handlers.delete(topic);
      return 0;
    }
    return handlers.length;
  }
}

export { RosinouContext };