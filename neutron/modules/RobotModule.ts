import { IConnectionContext } from "../context/ConnectionContext";
import { v4 as uuid } from "uuid";
import { IFrame, IFrameResult } from "../interfaces/frames";
import FrameFactory from "../frames/FrameFactory";
import { IRobotModule } from "../interfaces/RobotConnection";

export interface IRobotModuleBuilderArgs {
  name: string;
  context: IConnectionContext;
  framePackage?: Lowercase<string>;
}

export abstract class RobotModule implements IRobotModule {
  public abstract readonly type: Lowercase<string>;
  public readonly id: Lowercase<string>;
  public name: string;
  public framePackage: Lowercase<string>;
  protected context: IConnectionContext;
  protected frames: Record<string, IFrame>;

  public constructor(builder: IRobotModuleBuilderArgs) {
    this.id = uuid() as Lowercase<string>
    this.name = builder.name;
    this.context = builder.context;
    this.framePackage = builder.framePackage || "default";
    const frameFactory = new FrameFactory();
    const frames = frameFactory.getFramePackage(builder.framePackage ?? "");
    this.frames = frames.reduce((acc, frame) => {
      acc[frame.id] = frame;
      return acc;
    }, {} as { [key: string]: IFrame });
  }

  public abstract stop(): Promise<IFrameResult>;

  public abstract destroy(): Promise<void>;
}
