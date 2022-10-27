import { makeConnectionContext } from "../neutron/context/makeContext";
import { RobotConnectionType } from "../neutron/interfaces/RobotConnection";
import { makeModule } from "../neutron/modules/makeModule";
import { RobotBase } from "../neutron/modules/RobotBase";

describe("Modules", () => {
  test("should build a module from a configuration", () => {
    const context = makeConnectionContext(RobotConnectionType.ROSBRIDGE, {
      hostname: "localhost",
      port: 9090,
      type: RobotConnectionType.ROSBRIDGE,
    });
    const robotBaseConfiguration = {
      id: "robotbase",
      name: "Robot Base",
      type: "robotbase",
      moduleSpecifics: {
        directionnalSpeed: 0.5,
        rotationSpeed: 0.4,
      },
      framePackage: "osoyooBase",
    };

    const module = makeModule("robotbase", context, robotBaseConfiguration);
    expect(module).toBeDefined();
    expect(module.id.length).toBeGreaterThan(0);
    expect(module.name).toBe("Robot Base");
    expect(module.type).toBe("robotbase");
    const robotBase = module as RobotBase;
    expect(robotBase.configuration.directionnalSpeed).toBe(0.5);
    expect(robotBase.configuration.rotationSpeed).toBe(0.4);
    expect(robotBase.speed).toBe(50);
  });

  test("should throw an error if the module type is invalid", () => {
    const context = makeConnectionContext(RobotConnectionType.ROSBRIDGE, {
      hostname: "localhost",
      port: 9090,
      type: RobotConnectionType.ROSBRIDGE,
    });
    const robotBaseConfiguration = {
      id: "robotbase",
      name: "Robot Base",
      type: "robotbase",
      moduleSpecifics: {
        directionnalSpeed: 0.5,
        rotationSpeed: 0.4,
      },
      framePackage: "osoyooBase",
    };

    expect(() =>
      makeModule("invalid", context, robotBaseConfiguration)
    ).toThrowError("Invalid module type");
  });
});
