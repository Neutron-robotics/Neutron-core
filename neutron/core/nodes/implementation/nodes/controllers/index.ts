import ControllerNode from "./ControllerNode";

export interface IBaseNodeControllerPayload {
  x: number;
  rotationFactor: number;
  speed: number;
}

export class BaseControllerNode extends ControllerNode<IBaseNodeControllerPayload> {
  public readonly type = "base controller";
}

export interface IMJPEGCameraPayload {
  x: number;
  rotationFactor: number;
  speed: number;
}

export class MJPEGCameraNode extends ControllerNode<IBaseNodeControllerPayload> {
  public readonly type = "mjpegcamera";
}
