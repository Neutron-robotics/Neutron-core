import { IFrame, IFramePackage } from "../interfaces/frames";

export default class FrameFactory {
  private framePackages: IFramePackage[] = [];

  public buildFramePackage(framePackage: IFramePackage): IFrame[] {
    if (this.framePackages.find((fp) => fp.name === framePackage.name)) {
      throw new Error("Frame package already exists");
    }
    this.verifyFramePackage(framePackage);
    this.framePackages.push(framePackage);
    return framePackage.frames;
  }

  public getFramePackage(name: string): IFrame[] {
    const framePackage = this.framePackages.find((fp) => fp.name === name);
    if (!framePackage) {
      throw new Error("Frame package not found");
    }
    return framePackage.frames;
  }

  private verifyFramePackage(framePackage: IFramePackage): void {
    if (!framePackage.id || !framePackage.name || !framePackage.frames) {
      throw new Error("Invalid frame package");
    }
    framePackage.frames.forEach((frame) => {
      if (!frame.id || !frame.name || !frame.build) {
        throw new Error("Invalid frame");
      }
      if (frame.callBackFrames) {
        frame.callBackFrames.forEach((cbf) => {
          if (!framePackage.frames.find((f) => f.name === cbf)) {
            throw new Error("Callback frame not found");
          }
        });
      }
    });
  }
}
