import { IBaseNodeControllerPayload } from './BaseControllerNode';
import { InputControllerNode } from './InputControllerNode';

export interface IMJPEGCameraPayload {
    x: number;
    rotationFactor: number;
    speed: number;
  }

export class MJPEGCameraNode extends InputControllerNode<IBaseNodeControllerPayload> {
  public readonly type = 'mjpegcamera';
}
