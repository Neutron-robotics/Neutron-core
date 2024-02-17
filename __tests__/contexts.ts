import {
  Ros, Service, ServiceRequest, Topic, Message
} from 'roslib';
import { sleep } from '../neutron/utils/time';
import { ConnectionContextType, makeConnectionContext } from '../neutron/core/network/makeContext';
import RosContext from '../neutron/core/network/RosContext';

jest.mock('roslib');

describe('robot connection factory', () => {
  test('should make a connection context from a configuration', () => {
    const ctxConfiguration = {
      hostname: 'localhost',
      port: 9090,
      type: ConnectionContextType.Ros2
    };

    const context = makeConnectionContext(
      ConnectionContextType.Ros2,
      ctxConfiguration
    ) as RosContext;
    expect(context).toBeDefined();
    expect(context.type).toBe(ConnectionContextType.Ros2);
    expect(context.hostname).toBe('localhost');
    expect(context.port).toBe(9090);
    expect(context.isConnected).toBe(false);
  });

  test('should throw an error if the connection type is invalid', () => {
    const ctxConfiguration = {
      hostname: 'localhost',
      port: 9090,
      type: ConnectionContextType.Ros2
    };

    expect(() => makeConnectionContext(ConnectionContextType.Tcp, ctxConfiguration)).toThrowError('Invalid connection type');
  });
});

describe('Ros Contexts', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (Ros as any).mockClear();
    (Service as any).mockClear();
    (ServiceRequest as any).mockClear();
    (Topic as any).mockClear();
    (Message as any).mockClear();
  });

  test('Instanciate', () => {
    const rosContext = new RosContext({
      hostname: 'localhost',
      port: 9090,
      clientId: 'toto'
    });
    expect(rosContext).toBeDefined();
    expect(rosContext.isConnected).toBeFalsy();
    expect(rosContext.port).toBe(9090);
    expect(rosContext.hostname).toBe('localhost');
    expect(Ros).toHaveBeenCalled();
  });

  test('Connect', () => {
    const rosContext = new RosContext({
      hostname: 'localhost',
      port: 9090,
      clientId: 'toto'
    });
    rosContext.connect();

    const mockRosInstance = (Ros as any).mock.instances[0];
    const mockRosConnectInstance = mockRosInstance.connect;
    const mockRosOnInstance = mockRosInstance.on;
    expect(mockRosOnInstance).toHaveBeenCalledTimes(3);
    expect(mockRosConnectInstance.mock.calls[0][0]).toBe(
      'ws://localhost:9090/connection/toto'
    );
    expect(mockRosConnectInstance).toHaveBeenCalledWith(
      'ws://localhost:9090/connection/toto'
    );
    expect(mockRosConnectInstance).toHaveBeenCalled();
  });

  test('Disconnect', () => {
    const rosContext = new RosContext({
      hostname: 'localhost',
      port: 9090,
      clientId: 'toto'
    });
    rosContext.disconnect();

    const mockRosInstance = (Ros as any).mock.instances[0];
    const mockRosCloseInstance = mockRosInstance.close;
    expect(mockRosCloseInstance).toHaveBeenCalled();
  });

  test('Request', () => {
    const rosContext = new RosContext({
      hostname: 'localhost',
      port: 9090,
      clientId: 'toto'
    });

    rosContext.request('/std_types/Float64Array', '/move_something', {
      x: 0,
      y: 0
    });
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
      name: '/move_something',
      serviceType: '/std_types/Float64Array'
    });
  });

  test('Publish', () => {
    const rosContext = new RosContext({
      hostname: 'localhost',
      port: 9090,
      clientId: 'toto'
    });

    rosContext.publish('/move_something', '/std_types/Float64Array', {
      x: 0,
      y: 0
    });
    const mockTopicInstance = (Topic as any).mock.instances[0];
    const mockpublishInstance = mockTopicInstance.publish;
    expect(Topic).toHaveBeenCalledTimes(1);
    expect(mockpublishInstance).toHaveBeenCalledTimes(1);
    expect(mockpublishInstance).toHaveBeenCalledWith(
      new Message({ x: 0, y: 0 })
    );
    expect(Topic).toHaveBeenCalledWith({
      ros: (Ros as any).mock.instances[0],
      name: '/move_something',
      messageType: '/std_types/Float64Array',
      throttle_rate: 10,
      latch: false,
      queue_length: 1,
      queue_size: 10
    });
  });

  test('Subscribe to a topic', () => {
    const rosContext = new RosContext({
      hostname: 'localhost',
      port: 9090,
      clientId: 'toto'
    });
    const handler = jest.fn();
    rosContext.subscribe('/move_something', '/std_types/Float64Array', handler);
    const mockTopicInstance = (Topic as any).mock.instances[0];
    const mocksubscribeInstance = mockTopicInstance.subscribe;
    expect(Topic).toHaveBeenCalledTimes(1);
    expect(mocksubscribeInstance).toHaveBeenCalledTimes(1);
    expect(mocksubscribeInstance).toHaveBeenCalledWith(expect.any(Function));
    expect(Topic).toHaveBeenCalledWith({
      ros: (Ros as any).mock.instances[0],
      name: '/move_something',
      messageType: '/std_types/Float64Array',
      throttle_rate: 10,
      latch: false,
      queue_length: 1,
      queue_size: 10
    });
  });

  test('subscribe and unsubscribe', () => {
    const rosContext = new RosContext({
      hostname: 'localhost',
      port: 9090,
      clientId: 'toto'
    });
    const handler = jest.fn();
    rosContext.subscribe('/move_something', '/std_types/Float64Array', handler);
    const mockTopicInstance = (Topic as any).mock.instances[0];
    const mocksubscribeInstance = mockTopicInstance.subscribe;
    expect(Topic).toHaveBeenCalledTimes(1);
    expect(mocksubscribeInstance).toHaveBeenCalledTimes(1);
    expect(mocksubscribeInstance).toHaveBeenCalledWith(expect.any(Function));
    expect(Topic).toHaveBeenCalledWith({
      ros: (Ros as any).mock.instances[0],
      name: '/move_something',
      messageType: '/std_types/Float64Array',
      throttle_rate: 10,
      latch: false,
      queue_length: 1,
      queue_size: 10
    });
    rosContext.unsubscribe('/move_something', '/std_types/Float64Array', handler);
    const mockTopicInstance2 = (Topic as any).mock.instances[1];
    const mockunsubscribeInstance = mockTopicInstance2.unsubscribe;
    expect(mockunsubscribeInstance).toHaveBeenCalledTimes(1);
  });
});
