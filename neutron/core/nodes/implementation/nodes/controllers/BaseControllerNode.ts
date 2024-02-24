import { InputControllerNode } from './InputControllerNode';

export interface IBaseNodeControllerPayload {
    x: number;
    rotationFactor: number;
    speed: number;
  }

export class BaseControllerNode extends InputControllerNode<IBaseNodeControllerPayload> {
  public readonly type = 'base controller';
}
