export interface CameraInfoUpdate {
  resolution: Resolution;
  fps: number;
  active: boolean;
}

export interface Resolution {
  width: number;
  height: number;
  name: string;
}
