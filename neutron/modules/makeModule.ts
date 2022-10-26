import { IConnectionContext } from "../context/ConnectionContext";
import FrameFactory from "../frames/FrameFactory";
import { IRobotModule } from "../interfaces/RobotConnection";
import { Camera } from "./Camera";
import { RobotBase } from "./RobotBase";

export interface IModuleConfiguration {
  id: string;
  name: string;
  type: string;
  module: any;
  framePackage?: string;
}

export const makeModule = (
  type: string,
  context: IConnectionContext,
  configuration: IModuleConfiguration
): IRobotModule => {
  const frameFactory = new FrameFactory();
  const frames = frameFactory.getFramePackage(configuration.framePackage);
  switch (type) {
    case "robotbase":
      return new RobotBase(
        configuration.id,
        configuration.name,
        configuration.module,
        context,
        frames
      );
    case "camera":
      return new Camera(
        configuration.id,
        configuration.name,
        configuration.module,
        context,
        frames
      );
    default:
      throw new Error("Invalid module type");
  }
};
