import { RobotBase } from "../neutron/modules/OsoyooBase";
import { RosContext } from "../neutron/context/RosContext";

jest.mock("../neutron/context/RosContext");

describe("robot base tests", () => {
  var robotBase = undefined as unknown as RobotBase;

  beforeEach(() => {
    (RosContext as any).mockClear();
    const context = new RosContext({ host: "localhost", port: 9090 });
    robotBase = new RobotBase({
        id: "1",
        name: "test",
        directionnalSpeed: 0.5,
        rotationSpeed: 0.5,
    }, context, []);
  });

  test("Instanciate", () => {
    expect(robotBase).toBeDefined();
    expect(robotBase.id).toBe("1");
    expect(robotBase.name).toBe("test");
  });

//   test.todo("move", () => {
//     const robotBaseFramePackage = new RobotBaseFramePackage();
//     const robotBase = new RobotBase({
//       id: "test",
//       name: "test",
//       type: "test",
//       status: "test",
//       battery: 100,
//       connection: {
//         hostname: "localhost",
//         port: 9090,
//         type: "ros",
//       },
//       modules: [],
//     });
//     robotBase.move(robotBaseFramePackage);
//   });

//   test.todo("rotate", () => {});

//   test.todo("stop", () => {});
});
