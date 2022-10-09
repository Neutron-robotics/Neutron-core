import { RosContext } from "../neutron/context/RosContext";
import { Ros, Service, ServiceRequest, Topic, Message } from "roslib";
import {
  IRosFrameExecutor,
  IRosFrameExecutorPeriodic,
} from "../neutron/interfaces/frames";
import { moveFrame } from "../neutron/frames/OsoyooBaseFrames/moveFrame";
import { stopFrame } from "../neutron/frames/OsoyooBaseFrames/stopFrame";
import { sleep } from "../neutron/utils/time";

jest.mock("roslib");

describe("robot connection factory", () => {
  test.todo("should create a connection context from a configuration");

  // test
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
      host: "localhost",
      port: 9090,
    });
    expect(rosContext).toBeDefined();
    expect(rosContext.isConnected).toBeFalsy();
    expect(rosContext.port).toBe(9090);
    expect(rosContext.hostname).toBe("localhost");
    expect(Ros).toHaveBeenCalled();
  });

  test("Connect", () => {
    const rosContext = new RosContext({
      host: "localhost",
      port: 9090,
    });
    rosContext.connect();

    const mockRosInstance = (Ros as any).mock.instances[0];
    const mockRosConnectInstance = mockRosInstance.connect;
    const mockRosOnInstance = mockRosInstance.on;
    expect(mockRosOnInstance).toHaveBeenCalledTimes(3);
    expect(mockRosConnectInstance.mock.calls[0][0]).toBe("ws://localhost:9090");
    expect(mockRosConnectInstance).toHaveBeenCalledWith("ws://localhost:9090");
    expect(mockRosConnectInstance).toHaveBeenCalled();
  });

  test("Disconnect", () => {
    const rosContext = new RosContext({
      host: "localhost",
      port: 9090,
    });
    rosContext.disconnect();

    const mockRosInstance = (Ros as any).mock.instances[0];
    const mockRosCloseInstance = mockRosInstance.close;
    expect(mockRosCloseInstance).toHaveBeenCalled();
  });

  test("Request", () => {
    const frameExecutor: IRosFrameExecutor = {
      id: "abcd",
      method: "request",
      format: "/std_types/Float64Array",
      methodType: "/move_something",
      payload: {
        x: 0,
        y: 0,
      },
    };
    const rosContext = new RosContext({
      host: "localhost",
      port: 9090,
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
      id: "abcd",
      method: "send",
      format: "/std_types/Float64Array",
      methodType: "/move_something",
      payload: {
        x: 0,
        y: 0,
      },
    };
    const rosContext = new RosContext({
      host: "localhost",
      port: 9090,
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
      id: "abcd",
      method: "sendLoop",
      format: "/std_types/Float64Array",
      methodType: "/move_something",
      payload: {
        x: 0,
        y: 0,
      },
      period: 3,
    };
    const rosContext = new RosContext({
      host: "localhost",
      port: 9090,
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
      id: "abcd",
      method: "subscribe",
      format: "/std_types/Float64Array",
      methodType: "/move_something",
      payload: {
        x: 0,
        y: 0,
      },
    };
    const rosContext = new RosContext({
      host: "localhost",
      port: 9090,
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
      id: "abcd",
      method: "subscribe",
      format: "/std_types/Float64Array",
      methodType: "/move_something",
      payload: {
        x: 0,
        y: 0,
      },
    };
    const rosContext = new RosContext({
      host: "localhost",
      port: 9090,
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

  test("Execute a request", () => {
    const frameExecutor: IRosFrameExecutor = {
      id: "abcd",
      method: "request",
      format: "/std_types/Float64Array",
      methodType: "/move_something",
      payload: {
        x: 0,
        y: 0,
      },
    };
    const rosContext = new RosContext({
      host: "localhost",
      port: 9090,
    });
    rosContext.execute(frameExecutor);
    const mockServiceInstance = (Service as any).mock.instances[0];
    const mockcallServiceInstance = mockServiceInstance.callService;
    expect(Service).toHaveBeenCalledTimes(1);
    expect(mockcallServiceInstance).toHaveBeenCalledTimes(1);
    expect(mockcallServiceInstance).toHaveBeenCalledWith(
      new Message({ x: 0, y: 0 }),
      expect.any(Function),
      expect.any(Function)
    );
    expect(Service).toHaveBeenCalledWith({
      ros: (Ros as any).mock.instances[0],
      name: "/move_something",
      serviceType: "/std_types/Float64Array",
    });
  });

  test("Execute multiple frame", async () => {
    const rosContext = new RosContext({
      host: "localhost",
      port: 9090,
    });
    const moveExecutor = moveFrame.build([0, 0, 0, 0, 0, 0]);
    const res = await rosContext.execute(moveExecutor);
    expect(res.success).toBeTruthy();
    await sleep(2000);
    const stopExecutor = stopFrame.build({});
    const res2 = await rosContext.execute(stopExecutor);
    expect(res2.success).toBeTruthy();
    await sleep(2000)

    expect(Topic).toHaveBeenCalledTimes(3);
    expect(Topic).toHaveBeenCalledWith({
      ros: (Ros as any).mock.instances[0],
      name: "set_velocity",
      messageType: "/myrobotics/velocity",
      throttle_rate: 10,
      latch: false,
      queue_length: 1,
      queue_size: 10,
    });
    expect(Topic).toHaveBeenCalledWith({
      ros: (Ros as any).mock.instances[0],
      name: "keep_alive",
      messageType: "std_msgs/String",
      throttle_rate: 10,
      latch: false,
      queue_length: 1,
      queue_size: 10,
    });
    const mockpublishInstance = (Topic as any).mock.instances[0].publish;
    expect(mockpublishInstance).toHaveBeenCalledTimes(1);
    const mockpublishInstance2 = (Topic as any).mock.instances[1].publish;
    expect(mockpublishInstance2.mock.calls.length).toBeGreaterThan(4);
    expect(mockpublishInstance2.mock.calls.length).toBeLessThan(8);
  });
});
