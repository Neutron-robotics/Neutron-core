import { IConnectionContext } from "../context/ConnectionContext";
import FrameFactory from "../frames/FrameFactory";
import { IRobotModule } from "../interfaces/RobotConnection";
import { Camera } from "./Camera";
import { RobotBase } from "./RobotBase";

export interface IModuleConfiguration {
  id: string;
  name: string;
  type: string;
  moduleSpecifics: any;
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
        configuration.name,
        configuration.moduleSpecifics,
        context,
        frames
      );
    case "camera":
      return new Camera(
        configuration.name,
        configuration.moduleSpecifics,
        context,
        frames
      );
    default:
      throw new Error("Invalid module type");
  }
};
