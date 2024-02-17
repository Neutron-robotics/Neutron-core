import { InputControllerNode, OutputControllerNode } from './ControllerNode';

export interface IBaseNodeControllerPayload {
  x: number;
  rotationFactor: number;
  speed: number;
}

export class BaseControllerNode extends InputControllerNode<IBaseNodeControllerPayload> {
  public readonly type = 'base controller';
}

export interface IMJPEGCameraPayload {
  x: number;
  rotationFactor: number;
  speed: number;
}

export class MJPEGCameraNode extends InputControllerNode<IBaseNodeControllerPayload> {
  public readonly type = 'mjpegcamera';
}

export interface ICameraControllerPayload {
  state: 'on' | 'off'
}

export class CameraControllerNode extends InputControllerNode<ICameraControllerPayload> {
  public readonly type = 'camera controller';
}

export interface ICameraFramePayload {
  frame: string
}

export class CameraFrameNode extends InputControllerNode<ICameraFramePayload> {
  public readonly type = 'camera frame';
}
