interface IFrame {
  id: string;
  name: string;
  build(body: any): IFrameExecutor;
  callBackFrames?: string[];
}

interface IFramePackage {
    id: string;
    name: string;
    frames: IFrame[];
}

interface IFrameExecutor {
  id: string;
  methodType: string;
  method: string;
  payload: any;
}

export {
    IFrame,
    IFrameExecutor,
    IFramePackage,
}