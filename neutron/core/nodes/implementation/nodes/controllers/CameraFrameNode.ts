import { InputControllerNode } from './InputControllerNode';

export interface ICameraFramePayload {
    frame: string
  }

export class CameraFrameNode extends InputControllerNode<ICameraFramePayload> {
  public readonly type = 'camera frame';
}
