import {
  connectionInfosMock,
  robotStatusesForStopMock,
  robotStatusMock,
} from "../data/coreHTTPResponses";
import {
  RobotConnectionType,
  RobotStatus,
} from "../neutron/interfaces/RobotConnection";
import { Core } from "../neutron/modules/Core";
import axios from "axios";

jest.mock("axios");

describe("Robot core module", () => {
  test("Instanciate", () => {
    const core = new Core({
      hostname: "localhost",
      port: 8080,
      type: RobotConnectionType.HTTP,
    });
    expect(core).toBeDefined();
    expect(core.name).toBe("");
    expect(core.type).toBe("");
    expect(core.status).toBe(RobotStatus.Disconnected);
    expect(core.battery).toBe(-1);
    expect(core.modules).toBeDefined();
  });

  test("Fetch connection infos", async () => {
    (axios as any).create.mockImplementation(() => {
      return {
        get: () => Promise.resolve({ data: connectionInfosMock }),
      };
    });

    const core = new Core({
      hostname: "localhost",
      port: 8080,
      type: RobotConnectionType.HTTP,
    });
    await core.getConnectionInfo();
    expect(core.name).toBe("Development");
    expect(core.type).toBe("OsoyooRobot");
    expect(core.status).toBe(RobotStatus.Available);
    expect(core.battery).toBe(-1);
    expect(core.modules).toBeDefined();
    expect(core.modules.length).toBe(4);
    expect(core.contextConfiguration.hostname).toBe("localhost");
    expect(core.contextConfiguration.port).toBe(9090);
    expect(core.contextConfiguration.type).toBe(RobotConnectionType.ROSBRIDGE);
  });

  test("Fetch connection infos a multiple time", async () => {
    (axios as any).create.mockImplementation(() => {
      return {
        get: () => Promise.resolve({ data: connectionInfosMock }),
      };
    });

    const core = new Core({
      hostname: "localhost",
      port: 8080,
      type: RobotConnectionType.HTTP,
    });
    await core.getConnectionInfo();
    await core.getConnectionInfo();
    await core.getConnectionInfo();
    expect(core.name).toBe("Development");
    expect(core.type).toBe("OsoyooRobot");
    expect(core.status).toBe(RobotStatus.Available);
    expect(core.battery).toBe(-1);
    expect(core.modules).toBeDefined();
    expect(core.modules.length).toBe(4);
    expect(core.contextConfiguration.hostname).toBe("localhost");
    expect(core.contextConfiguration.port).toBe(9090);
    expect(core.contextConfiguration.type).toBe(RobotConnectionType.ROSBRIDGE);
  });

  test("Get connection configuration", async () => {
    (axios as any).create.mockImplementation(() => {
      return {
        get: () => Promise.resolve({ data: connectionInfosMock }),
      };
    });

    const core = new Core({
      hostname: "localhost",
      port: 8080,
      type: RobotConnectionType.HTTP,
    });
    await core.getConnectionInfo();
    const infos = core.connectionConfiguration;

    expect(infos).toBeDefined();
    expect(infos.id).toBeDefined();
    expect(infos.name).toBe("Development");
    expect(infos.type).toBe("OsoyooRobot");
    expect(infos.batteryInfo).toBeDefined();
    expect(infos.batteryInfo.level).toBe(-1);
    expect(infos.batteryInfo.measurement).toBe("percent");
    expect(infos.batteryInfo.charging).toBe(false);
    expect(infos.status).toBe(RobotStatus.Available);
    expect(infos.modules).toBeDefined();
    expect(infos.modules.length).toBe(4);
    expect(infos.context.hostname).toBe("localhost");
    expect(infos.context.port).toBe(9090);
  });

  test("Get connection status", async () => {
    (axios as any).create.mockImplementation(() => {
      return {
        get: (uri: string) => {
          if (uri === "/robot/configuration")
            return Promise.resolve({ data: connectionInfosMock });
          else if (uri === "/robot/status")
            return Promise.resolve({ data: robotStatusMock });
          else throw new Error("Invalid URI");
        },
      };
    });

    const core = new Core({
      hostname: "localhost",
      port: 8080,
      type: RobotConnectionType.HTTP,
    });
    await core.getConnectionInfo();
    await core.getProcessesStatus();
    expect(core.modules).toBeDefined();
    expect(core.modules.length).toBe(4);
    expect(core.modules[1].name).toBe("Camera");
    expect(core.modules[0].process).not.toBeDefined();
    expect(core.modules[2].process).not.toBeDefined();
    expect(core.modules[3].process).not.toBeDefined();
    expect(core.modules[1].process).toBeDefined();
    expect(core.modules[1].process!.name).toBe("Camera");
    expect(core.modules[1].process!.active).toBe(true);
    expect(core.modules[1].process!.cpu).toBe(0.0);
    expect(core.modules[1].process!.mem).toBe(1.759722351829313);
    expect(core.modules[1].process!.mem_usage).toBe(35452.0);
    expect(core.modules[1].process!.pid).toBe(469122);
  });

  test("Get connection status multiple time", async () => {
    (axios as any).create.mockImplementation(() => {
      return {
        get: (uri: string) => {
          if (uri === "/robot/configuration")
            return Promise.resolve({ data: connectionInfosMock });
          else if (uri === "/robot/status")
            return Promise.resolve({ data: robotStatusMock });
          else throw new Error("Invalid URI");
        },
      };
    });

    const core = new Core({
      hostname: "localhost",
      port: 8080,
      type: RobotConnectionType.HTTP,
    });
    await core.getConnectionInfo();
    await core.getProcessesStatus();
    await core.getConnectionInfo();
    await core.getProcessesStatus();
    await core.getProcessesStatus();
    await core.getProcessesStatus();
    expect(core.modules).toBeDefined();
    expect(core.modules.length).toBe(4);
    expect(core.modules[1].name).toBe("Camera");
    expect(core.modules[0].process).not.toBeDefined();
    expect(core.modules[2].process).not.toBeDefined();
    expect(core.modules[3].process).not.toBeDefined();
    expect(core.modules[1].process).toBeDefined();
    expect(core.modules[1].process!.name).toBe("Camera");
    expect(core.modules[1].process!.active).toBe(true);
    expect(core.modules[1].process!.cpu).toBe(0.0);
    expect(core.modules[1].process!.mem).toBe(1.759722351829313);
    expect(core.modules[1].process!.mem_usage).toBe(35452.0);
    expect(core.modules[1].process!.pid).toBe(469122);
  });

  test("Start a process while no module is set", async () => {
    (axios as any).create.mockImplementation(() => {
      return {
        post: (uri: string) => {
          if (uri === "/start")
            return Promise.resolve({ data: { success: true } });
          else throw new Error("Invalid URI");
        },
      };
    });

    const core = new Core({
      hostname: "localhost",
      port: 8080,
      type: RobotConnectionType.HTTP,
    });
    expect(core.modules.length).toBe(0);
    const res = await core.startRobotProcess(
      "98932797-ea76-4ce1-b699-842ce54cedc6"
    );
    expect(res).toBe(false);
  });

  test("Start a process successfuly", async () => {
    (axios as any).create.mockImplementation(() => {
      return {
        get: (uri: string) => {
          if (uri === "/robot/configuration")
            return Promise.resolve({ data: connectionInfosMock });
          else if (uri === "/robot/status")
            return Promise.resolve({ data: robotStatusMock });
          else throw new Error("Invalid URI");
        },
        post: (uri: string) => {
          if (uri === "/start")
            return Promise.resolve({ data: { success: true }, status: 200 });
          else throw new Error("Invalid URI");
        },
      };
    });

    const core = new Core({
      hostname: "localhost",
      port: 8080,
      type: RobotConnectionType.HTTP,
    });
    await core.getConnectionInfo();
    expect(core.modules.length).toBe(4);
    const res = await core.startRobotProcess(
      "98932797-ea76-4ce1-b699-842ce54cedc6"
    );
    expect(res).toBe(true);
  });

  test("Start a process that does not exist", async () => {
    (axios as any).create.mockImplementation(() => {
      return {
        get: (uri: string) => {
          if (uri === "/robot/configuration")
            return Promise.resolve({ data: connectionInfosMock });
          else if (uri === "/robot/status")
            return Promise.resolve({ data: robotStatusMock });
          else throw new Error("Invalid URI");
        },
        post: (uri: string) => {
          if (uri === "/start")
            return Promise.resolve({ data: { success: true }, status: 200 });
          else throw new Error("Invalid URI");
        },
      };
    });

    const core = new Core({
      hostname: "localhost",
      port: 8080,
      type: RobotConnectionType.HTTP,
    });
    await core.getConnectionInfo();
    expect(core.modules.length).toBe(4);
    const res = await core.startRobotProcess(
      "98932797-bbbb-4ce1-b699-842ce54cedc6"
    );
    expect(res).toBe(false);
  });

  test("Start all processes", async () => {
    const start = jest.fn();
    (axios as any).create.mockImplementation(() => {
      return {
        get: (uri: string) => {
          if (uri === "/robot/configuration")
            return Promise.resolve({ data: connectionInfosMock });
          else if (uri === "/robot/status")
            return Promise.resolve({ data: [] });
          else throw new Error("Invalid URI");
        },
        post: (uri: string) => {
          if (uri === "/start") {
            start();
            return Promise.resolve({ data: { success: true }, status: 200 });
          } else throw new Error("Invalid URI");
        },
      };
    });

    const core = new Core({
      hostname: "localhost",
      port: 8080,
      type: RobotConnectionType.HTTP,
    });
    await core.getConnectionInfo();
    expect(core.modules.length).toBe(4);
    const res = await core.startProcesses();
    expect(res).toBe(true);
    expect(start).toHaveBeenCalledTimes(4);
  });

  test("Stop a process", async () => {
    (axios as any).create.mockImplementation(() => {
      return {
        get: (uri: string) => {
          if (uri === "/robot/configuration")
            return Promise.resolve({ data: connectionInfosMock });
          else if (uri === "/robot/status")
            return Promise.resolve({ data: robotStatusMock });
          else throw new Error("Invalid URI");
        },
        post: (uri: string) => {
          if (uri === "/stop")
            return Promise.resolve({ data: { success: true }, status: 200 });
          else throw new Error("Invalid URI");
        },
      };
    });

    const core = new Core({
      hostname: "localhost",
      port: 8080,
      type: RobotConnectionType.HTTP,
    });
    await core.getConnectionInfo();
    await core.getProcessesStatus();
    expect(core.modules.length).toBe(4);
    const res = await core.stopRobotProcess(
      "98932797-ea76-4ce1-b699-842ce54cedc6"
    );
    expect(res).toBe(true);
  });

  test("Stop a process that does not exist", async () => {
    (axios as any).create.mockImplementation(() => {
      return {
        get: (uri: string) => {
          if (uri === "/robot/configuration")
            return Promise.resolve({ data: connectionInfosMock });
          else if (uri === "/robot/status")
            return Promise.resolve({ data: robotStatusMock });
          else throw new Error("Invalid URI");
        },
        post: (uri: string) => {
          if (uri === "/stop")
            return Promise.resolve({ data: { success: true }, status: 200 });
          else throw new Error("Invalid URI");
        },
      };
    });

    const core = new Core({
      hostname: "localhost",
      port: 8080,
      type: RobotConnectionType.HTTP,
    });
    await core.getConnectionInfo();
    await core.getProcessesStatus();
    expect(core.modules.length).toBe(4);
    const res = await core.stopRobotProcess(
      "98932797-bbbb-4ce1-b699-842ce54cedc6"
    );
    expect(res).toBe(false);
  });

  test("Start all processes", async () => {
    const stop = jest.fn();
    (axios as any).create.mockImplementation(() => {
      return {
        get: (uri: string) => {
          if (uri === "/robot/configuration")
            return Promise.resolve({ data: connectionInfosMock });
          else if (uri === "/robot/status")
            return Promise.resolve({ data: robotStatusesForStopMock });
          else throw new Error("Invalid URI");
        },
        post: (uri: string) => {
          if (uri === "/stop") {
            stop();
            return Promise.resolve({ data: { success: true }, status: 200 });
          } else throw new Error("Invalid URI");
        },
      };
    });

    const core = new Core({
      hostname: "localhost",
      port: 8080,
      type: RobotConnectionType.HTTP,
    });
    await core.getConnectionInfo();
    expect(core.modules.length).toBe(4);
    const res = await core.stopProcesses();
    expect(res).toBe(true);
    expect(stop).toHaveBeenCalledTimes(4);
  });
});
