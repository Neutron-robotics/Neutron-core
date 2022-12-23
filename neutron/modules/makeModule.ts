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
  const robotModuleBuilder = {
    name: configuration.name,
    context,
    framePackage: configuration.framePackage,
    ...configuration.moduleSpecifics,
  };
  switch (type) {
    case "robotbase":
      return new RobotBase(robotModuleBuilder);
    case "camera":
      return new Camera(robotModuleBuilder);
    default:
      throw new Error("Invalid module type " + type);
  }
};
