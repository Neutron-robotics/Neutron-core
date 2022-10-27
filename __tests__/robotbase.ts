import { RobotBase } from "../neutron/modules/RobotBase";
import { RosContext } from "../neutron/context/RosContext";
import OsoyooBaseFrames from "../neutron/frames/OsoyooBaseFrames/index";

jest.mock("../neutron/context/RosContext");

describe("robot base tests", () => {
  var robotBase = undefined as unknown as RobotBase;

  beforeEach(() => {
    (RosContext as any).mockClear();
    const context = new RosContext({ hostname: "localhost", port: 9090 });
    robotBase = new RobotBase(
      "test",
      {
        directionnalSpeed: 1,
        rotationSpeed: 0.5,
      },
      context,
      OsoyooBaseFrames.frames
    );
  });

  test("Instanciate", () => {
    expect(robotBase).toBeDefined();
    expect(robotBase.id.length).toBeGreaterThan(0);
    expect(robotBase.name).toBe("test");
  });

  test("move", async () => {
    const movement = [1, 0, 0, 0, 0, 1];
    await robotBase.move(movement);
    expect(robotBase.speed).toBe(50);
    const mockcallExecute = (RosContext as any).mock.instances[0].execute;
    expect(mockcallExecute).toHaveBeenCalledTimes(1);
    expect(mockcallExecute).toHaveBeenCalledWith({
      id: expect.anything(),
      methodType: "set_velocity",
      format: "/myrobotics/velocity",
      method: "send",
      payload: {
        x: 50,
        y: 0,
        z: 0,
        roll: 0,
        pitch: 0,
        yaw: 25,
      },
      next: expect.anything(),
    });
  });

  test("stop", async () => {
    await robotBase.stop();
    expect(robotBase.speed).toBe(50);
    const mockcallExecute = (RosContext as any).mock.instances[0].execute;
    expect(mockcallExecute).toHaveBeenCalledTimes(1);
    expect(mockcallExecute).toHaveBeenCalledWith({
      id: expect.anything(),
      methodType: "stop",
      format: "std_msgs/String",
      method: "send",
      loopCancellationToken: "keep_alive",
      payload: {},
    });
  });
});
