import {
  ActionClient,
  Goal,
  Message,
  Ros,
  Service,
  ServiceRequest,
  ServiceResponse,
  Topic,
} from "roslib";
import NeutronConnectionContext from "./NeutronConnectionContext";
import WebSocket from "ws";
import { ConnectionContextType } from "./connection";
import { TopicSettings } from '../ros2/topicSettings'

export interface RosContextConfiguration {
  hostname: string;
  port: number;
  clientId: string;
}

export interface RosActionGoal {
  message: any;
  feedback?: RosActionCallback;
  result?: RosActionCallback;
  status?: RosActionCallback;
  timeout?: RosActionCallback;
}

export type RosActionCallback = (data: any) => void;

export type RosSubscriptionHandler = (data: Message) => void;

class RosContext extends NeutronConnectionContext {
  private ros: Ros;

  private clientId: string;

  public hostname: string;

  public port: number;

  public override get isConnected(): boolean {
    return this.ros?.isConnected ?? false;
  }

  protected override get ws() {
    return (this.ros as any).socket as WebSocket;
  }

  constructor(config: RosContextConfiguration) {
    super(ConnectionContextType.Ros2);
    this.ros = new Ros({});
    this.clientId = config.clientId;
    this.hostname = config.hostname;
    this.port = config.port;
  }

  public connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.ros.on("connection", () => {
        this.connected();
        resolve(true);
      });

      this.ros.on("error", (error: any) => {
        console.log("Error connecting to websocket server: ", error);
        resolve(false);
      });

      this.ros.on("close", () => {
        console.log("Connection to websocket server closed.");
      });

      this.ros.connect(
        `ws://${this.hostname}:${this.port}/connection/${this.clientId}`
      );
    });
  }

  public disconnect(): void {
    this.ros.close();
  }

  public request(
    serviceType: string,
    methodType: string,
    payload: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const onSuccess = (result: ServiceResponse) => {
        resolve(result);
      };
      const onError = (error: any) => {
        reject(error);
      };

      const service = new Service({
        ros: this.ros,
        name: methodType,
        serviceType,
      });

      const serviceRequest = new ServiceRequest(payload);
      service.callService(serviceRequest, onSuccess, onError);
    });
  }

  public callAction(
    actionName: string,
    serverName: string,
    goalMessages: RosActionGoal[]
  ): void {
    const actionClient = new ActionClient({
      ros: this.ros,
      serverName,
      actionName,
    });

    for (const goalMessage of goalMessages) {
      const goal = new Goal({
        actionClient,
        goalMessage: goalMessage.message,
      });

      if (goalMessage.feedback) goal.on("feedback", goalMessage.feedback);
      if (goalMessage.result) goal.on("result", goalMessage.result);
      if (goalMessage.status) goal.on("status", goalMessage.status);
      if (goalMessage.timeout) goal.on("timeout", goalMessage.timeout);
    }
  }

  public publish(topic: string, messageType: string, payload: any) {
    const topicSettings: TopicSettings = {
      topic,
      messageType,
    };
    const topicInstance: Topic<Message> = this.getTopic(topicSettings);
    const message = new Message(payload);
    topicInstance.advertise()
    topicInstance.publish(message);
    topicInstance.unadvertise();
  }

  public subscribe(
    topic: string,
    messageType: string,
    handler: RosSubscriptionHandler
  ) {
    const topicSettings: TopicSettings = {
      topic,
      messageType,
    };
    const topicInstance = this.getTopic(topicSettings);
    topicInstance.subscribe(handler);
  }

  public unsubscribe(
    topic: string,
    messageType: string,
    handler: RosSubscriptionHandler
  ) {
    const topicSettings: TopicSettings = {
      topic,
      messageType,
    };
    const topicInstance = this.getTopic(topicSettings);
    topicInstance.unsubscribe(handler);
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

export default RosContext;
