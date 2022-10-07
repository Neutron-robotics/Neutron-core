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

interface IRosContextConfiguration {
  host: string;
  port: number;
}

class RosinouContext extends ConnectionContext {
  private ros: Ros;

  public get isConnected(): boolean {
    return this.ros.isConnected;
  }

  constructor(config: IRosContextConfiguration) {
    super("rosinou", config);
    this.ros = new Ros({});
  }

  public connect(): Promise<boolean> {
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

  public disconnect(): Promise<boolean> {
    this.ros.close();
    return Promise.resolve(true);
  }

  public request(executor: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const onSuccess = (result: ServiceResponse) => {
        resolve(result);
      };
      const onError = (error: any) => {
        reject(error);
      };

      const { serviceType, payload } = executor;
      const service = new Service({
        ros: this.ros,
        name: serviceType,
        serviceType: payload.format,
      });
      const serviceRequest = new ServiceRequest(payload.data);
      service.callService(serviceRequest, onSuccess, onError);
    });
  }

  public send(executor: any): Promise<any> {
    const { serviceType, payload } = executor;
    const topicSettings: TopicSettings = {
      topic: serviceType,
      messageType: payload.format,
    };
    const topicInstance = this.getTopic(topicSettings);
    const message = new Message(payload.data);
    topicInstance.publish(message);
    topicInstance.unadvertise();
    return Promise.resolve(true);
  }

  public sendLoop(executor: any): any {
    const { serviceType, payload, period } = executor;
    const topicSettings: TopicSettings = {
      topic: serviceType,
      messageType: payload.format,
    };
    const topicInstance = this.getTopic(topicSettings);
    const message = new Message(payload.data);
    const interval = setInterval(() => {
      topicInstance.publish(message);
      console.log("publishing");
    }, (1 / period) * 1000);
    return {
      interval,
    };
  }

  public subscribe(executor: any): Promise<any> {
    const { serviceType, payload, onMessage } = executor;
    const topicSettings: TopicSettings = {
      topic: serviceType,
      messageType: payload.format,
    };
    const topicInstance = this.getTopic(topicSettings);
    const message = new Message(payload.data);
    topicInstance.subscribe((message: any) => onMessage);
    return Promise.resolve(true);
  }

  public execute(executor: any): Promise<any> {
    switch (executor.type) {
      case "request":
        return this.request(executor);
      case "send":
        return this.send(executor);
      case "sendLoop":
        return this.sendLoop(executor);
      case "subscribe":
        return this.subscribe(executor);
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
}

export { RosinouContext };
