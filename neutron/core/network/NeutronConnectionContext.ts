import WebSocket, { MessageEvent, RawData } from 'ws';
import {
  ConnectionContextType,
  NeutronConnectionInfoMessage,
  RobotStatus
} from './connection';
import { ILiteEvent, LiteEvent } from '../../utils/LiteEvent';

abstract class NeutronConnectionContext {
  public type: ConnectionContextType;

  public abstract isConnected: boolean;

  protected abstract ws: WebSocket;

  public connectionUpdated: ILiteEvent<NeutronConnectionInfoMessage>;

  public robotUpdated: ILiteEvent<RobotStatus>;

  constructor(type: ConnectionContextType) {
    this.type = type;
    this.connectionUpdated = new LiteEvent<NeutronConnectionInfoMessage>();
    this.robotUpdated = new LiteEvent<RobotStatus>();
  }

  public abstract connect(): Promise<boolean>;

  public abstract disconnect(): void;

  public getInfo(): Promise<NeutronConnectionInfoMessage> {
    return new Promise((res, rej) => {
      this.connectionUpdated.once(e => res(e));
      setTimeout(
        () => rej('Reached timeout of 5000ms waiting for info message'),
        5000
      );
      const infoRequest = {
        command: 'infos',
        params: ''
      };
      const requestMessage = JSON.stringify(infoRequest);
      console.log('SENDING ', requestMessage, this.ws.send);
      this.ws.send(requestMessage);
    });
  }

  public removeUser(userId: string) {
    const removeRequest = {
      command: 'remove',
      params: userId
    };
    const requestMessage = JSON.stringify(removeRequest);
    this.ws.send(requestMessage);
  }

  public promoteUser(userId: string) {
    const promoteRequest = {
      command: 'promote',
      params: userId
    };
    const requestMessage = JSON.stringify(promoteRequest);
    this.ws.send(requestMessage);
  }

  public quit() {
    const quitRequest = {
      command: 'quit',
      params: ''
    };
    const requestMessage = JSON.stringify(quitRequest);
    this.ws.send(requestMessage);
  }

  public pollRobotStatus() {
    const pollRequest = {
      command: 'robotStatus',
      params: ''
    };
    const requestMessage = JSON.stringify(pollRequest);
    this.ws.send(requestMessage);
  }

  protected connected = () => {
    console.log('ws', this.ws);
    this.ws.addEventListener('message', this.handleWsMessageReceived);
    // this.ws.on("message", this.handleWsMessageReceived);
  };

  private handleWsMessageReceived = (data: MessageEvent) => {
    // const message = JSON.parse(
    //   String.fromCharCode.apply(null, new Uint16Array(data.data as any) as any)
    // );
    const message = JSON.parse(data.data as string) as any;
    if (!message) return;

    if (message?.messageType === 'connectionInfos') {
      this.connectionUpdated.trigger(message.message);
    } else if (message?.messageType === 'robotStatus') {
      this.robotUpdated.trigger(message.message);
    }
  };
}

export default NeutronConnectionContext;
