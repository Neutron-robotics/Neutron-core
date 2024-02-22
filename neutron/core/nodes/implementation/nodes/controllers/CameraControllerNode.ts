import { InputControllerNode } from './InputControllerNode';

export interface ICameraControllerPayload {
    state: 'on' | 'off'
  }

export class CameraControllerNode extends InputControllerNode<ICameraControllerPayload> {
  public readonly type = 'camera controller';
}
