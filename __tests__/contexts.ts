import { RosContext } from "../neutron/context/RosContext";
import { Ros, Service, ServiceRequest, Topic, Message } from "roslib";
import {
  IRosFrameExecutor,
  IRosFrameExecutorPeriodic,
} from "../neutron/interfaces/frames";
import { sleep } from "../neutron/utils/time";
import { makeConnectionContext } from "../neutron/context/makeContext";
import { RobotConnectionType } from "../neutron/interfaces/RobotConnection";

jest.mock("roslib");

describe("robot connection factory", () => {
  test("should make a connection context from a configuration", () => {
    const ctxConfiguration = {
      hostname: "localhost",
      port: 9090,
      type: RobotConnectionType.ROSBRIDGE,
    };

    const context = makeConnectionContext(
      RobotConnectionType.ROSBRIDGE,
      ctxConfiguration
    );
    expect(context).toBeDefined();
    expect(context.type).toBe(RobotConnectionType.ROSBRIDGE);
    expect(context.hostname).toBe("localhost");
    expect(context.port).toBe(9090);
    expect(context.isConnected).toBe(false);
  });

  test("should throw an error if the connection type is invalid", () => {
    const ctxConfiguration = {
      hostname: "localhost",
      port: 9090,
      type: RobotConnectionType.ROSBRIDGE,
    };

    expect(() =>
      makeConnectionContext(RobotConnectionType.TCP, ctxConfiguration)
    ).toThrowError("Invalid connection type");
  });
});

describe("Ros Contexts", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (Ros as any).mockClear();
    (Service as any).mockClear();
    (ServiceRequest as any).mockClear();
    (Topic as any).mockClear();
    (Message as any).mockClear();
  });

  test("Instanciate", () => {
    const rosContext = new RosContext({
      hostname: "localhost",
      port: 9090,
      clientId: "toto",
    });
    expect(rosContext).toBeDefined();
    expect(rosContext.isConnected).toBeFalsy();
    expect(rosContext.port).toBe(9090);
    expect(rosContext.hostname).toBe("localhost");
    expect(Ros).toHaveBeenCalled();
  });

  test("Connect", () => {
    const rosContext = new RosContext({
      hostname: "localhost",
      port: 9090,
      clientId: "toto",
    });
    rosContext.connect();

    const mockRosInstance = (Ros as any).mock.instances[0];
    const mockRosConnectInstance = mockRosInstance.connect;
    const mockRosOnInstance = mockRosInstance.on;
    expect(mockRosOnInstance).toHaveBeenCalledTimes(3);
    expect(mockRosConnectInstance.mock.calls[0][0]).toBe(
      "ws://localhost:9090/connection/toto"
    );
    expect(mockRosConnectInstance).toHaveBeenCalledWith(
      "ws://localhost:9090/connection/toto"
    );
    expect(mockRosConnectInstance).toHaveBeenCalled();
  });

  test("Disconnect", () => {
    const rosContext = new RosContext({
      hostname: "localhost",
      port: 9090,
      clientId: "toto",
    });
    rosContext.disconnect();

    const mockRosInstance = (Ros as any).mock.instances[0];
    const mockRosCloseInstance = mockRosInstance.close;
    expect(mockRosCloseInstance).toHaveBeenCalled();
  });

  test("Request", () => {
    const frameExecutor: IRosFrameExecutor = {
      format: "/std_types/Float64Array",
      methodType: "/move_something",
      payload: {
        x: 0,
        y: 0,
      },
    };
    const rosContext = new RosContext({
      hostname: "localhost",
      port: 9090,
      clientId: "toto",
    });

    rosContext.request(frameExecutor);
    const mockServiceInstance = (Service as any).mock.instances[0];
    const mockcallServiceInstance = mockServiceInstance.callService;
    expect(Service).toHaveBeenCalledTimes(1);
    expect(ServiceRequest).toHaveBeenCalledTimes(1);
    expect(mockcallServiceInstance).toHaveBeenCalledTimes(1);
    expect(mockcallServiceInstance).toHaveBeenCalledWith(
      new ServiceRequest({ x: 0, y: 0 }),
      expect.any(Function),
      expect.any(Function)
    );

    expect(Service).toHaveBeenCalledWith({
      ros: (Ros as any).mock.instances[0],
      name: "/move_something",
      serviceType: "/std_types/Float64Array",
    });
  });

  test("Send", () => {
    const frameExecutor: IRosFrameExecutor = {
      format: "/std_types/Float64Array",
      methodType: "/move_something",
      payload: {
        x: 0,
        y: 0,
      },
    };
    const rosContext = new RosContext({
      hostname: "localhost",
      port: 9090,
      clientId: "toto",
    });

    rosContext.send(frameExecutor);
    const mockTopicInstance = (Topic as any).mock.instances[0];
    const mockpublishInstance = mockTopicInstance.publish;
    expect(Topic).toHaveBeenCalledTimes(1);
    expect(mockpublishInstance).toHaveBeenCalledTimes(1);
    expect(mockpublishInstance).toHaveBeenCalledWith(
      new Message({ x: 0, y: 0 })
    );
    expect(Topic).toHaveBeenCalledWith({
      ros: (Ros as any).mock.instances[0],
      name: "/move_something",
      messageType: "/std_types/Float64Array",
      throttle_rate: 10,
      latch: false,
      queue_length: 1,
      queue_size: 10,
    });
  });

  test("SendLoop", async () => {
    const frameExecutor: IRosFrameExecutorPeriodic = {
      format: "/std_types/Float64Array",
      methodType: "/move_something",
      payload: {
        x: 0,
        y: 0,
      },
      period: 3,
    };
    const rosContext = new RosContext({
      hostname: "localhost",
      port: 9090,
      clientId: "toto",
    });

    const res = await rosContext.sendLoop(frameExecutor);
    const onSend = jest.fn();
    res.event.on(onSend);
    await sleep(2000);
    res.stop();
    expect(onSend.mock.calls.length).toBeGreaterThan(4);
    await sleep(2000);
    expect(onSend.mock.calls.length).toBeGreaterThan(4);
    expect(onSend.mock.calls.length).toBeLessThanOrEqual(6);

    const mockTopicInstance = (Topic as any).mock.instances[0];
    const mockpublishInstance = mockTopicInstance.publish;
    expect(Topic).toHaveBeenCalledTimes(1);
    expect(mockpublishInstance.mock.calls.length).toBeGreaterThan(4);
    expect(mockpublishInstance).toHaveBeenCalledWith(
      new Message({ x: 0, y: 0 })
    );
    expect(Topic).toHaveBeenCalledWith({
      ros: (Ros as any).mock.instances[0],
      name: "/move_something",
      messageType: "/std_types/Float64Array",
      throttle_rate: 10,
      latch: false,
      queue_length: 1,
      queue_size: 10,
    });
  });

  test("Subscribe to an event", () => {
    const frameExecutor: IRosFrameExecutor = {
      format: "/std_types/Float64Array",
      methodType: "/move_something",
      payload: {
        x: 0,
        y: 0,
      },
    };
    const rosContext = new RosContext({
      hostname: "localhost",
      port: 9090,
      clientId: "toto",
    });
    const handler = jest.fn();
    rosContext.on(frameExecutor, handler);
    const mockTopicInstance = (Topic as any).mock.instances[0];
    const mocksubscribeInstance = mockTopicInstance.subscribe;
    expect(Topic).toHaveBeenCalledTimes(1);
    expect(mocksubscribeInstance).toHaveBeenCalledTimes(1);
    expect(mocksubscribeInstance).toHaveBeenCalledWith(expect.any(Function));
    expect(Topic).toHaveBeenCalledWith({
      ros: (Ros as any).mock.instances[0],
      name: "/move_something",
      messageType: "/std_types/Float64Array",
      throttle_rate: 10,
      latch: false,
      queue_length: 1,
      queue_size: 10,
    });
  });

  test("subscribe and unsubscribe", () => {
    const frameExecutor: IRosFrameExecutor = {
      format: "/std_types/Float64Array",
      methodType: "/move_something",
      payload: {
        x: 0,
        y: 0,
      },
    };
    const rosContext = new RosContext({
      hostname: "localhost",
      port: 9090,
      clientId: "toto",
    });
    const handler = jest.fn();
    rosContext.on(frameExecutor, handler);
    const mockTopicInstance = (Topic as any).mock.instances[0];
    const mocksubscribeInstance = mockTopicInstance.subscribe;
    expect(Topic).toHaveBeenCalledTimes(1);
    expect(mocksubscribeInstance).toHaveBeenCalledTimes(1);
    expect(mocksubscribeInstance).toHaveBeenCalledWith(expect.any(Function));
    expect(Topic).toHaveBeenCalledWith({
      ros: (Ros as any).mock.instances[0],
      name: "/move_something",
      messageType: "/std_types/Float64Array",
      throttle_rate: 10,
      latch: false,
      queue_length: 1,
      queue_size: 10,
    });
    rosContext.off(frameExecutor, handler);
    const mockTopicInstance2 = (Topic as any).mock.instances[1];
    const mockunsubscribeInstance = mockTopicInstance2.unsubscribe;
    expect(mockunsubscribeInstance).toHaveBeenCalledTimes(1);
  });
});
