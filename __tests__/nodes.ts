import { NodeMessage } from '../neutron/core/nodes/INeutronNode';
import { NodeFactory } from '../neutron/core/nodes/NodeFactory';
import { ErrorNode, InjectNode } from '../neutron/core/nodes/implementation/nodes';
import { DebugNode } from '../neutron/core/nodes/implementation/nodes/functions/DebugNode';
import { flowGraphMock } from './__mixture__/flowGraphMock';

jest.mock('../neutron/core/network/makeContext');

describe('Neutron Nodes', () => {
  const mockNodeDb = flowGraphMock.nodes[0];

  const makeNodeBuilder = (type: string, specifics: any) => ({
    ...mockNodeDb,
    data: { ...mockNodeDb.data, name: type, specifics }
  });

  it('Change Node define a field', async () => {
    const specifics = {
      fields: [
        {
          id: '',
          mode: 'define',
          inputField: 'toto',
          targetField: 'foo'
        }
      ]
    };

    const node = NodeFactory.createNode(makeNodeBuilder('change', specifics));
    const message: NodeMessage = {
      payload: {
        toto: 1
      }
    };
    const response = await node.processNode(message);
    expect(response?.payload.foo).toBe(1);
    expect(response?.payload.toto).toBe(1);
  });

  it('Change Node remove a field', async () => {
    const specifics = {
      fields: [
        {
          id: '',
          mode: 'remove',
          inputField: 'toto'
        }
      ]
    };

    const node = NodeFactory.createNode(makeNodeBuilder('change', specifics));
    const message: NodeMessage = {
      payload: {
        toto: 1
      }
    };
    const response = await node.processNode(message);
    expect(response?.payload.toto).not.toBeDefined();
  });

  it('Change Node move a field', async () => {
    const specifics = {
      fields: [
        {
          id: '',
          mode: 'move',
          inputField: 'toto',
          targetField: 'foo'
        }
      ]
    };

    const node = NodeFactory.createNode(makeNodeBuilder('change', specifics));
    const message: NodeMessage = {
      payload: {
        toto: 1
      }
    };
    const response = await node.processNode(message);
    expect(response?.payload.foo).toBe(1);
    expect(response?.payload.toto).not.toBeDefined();
  });

  it('Debug node', async () => {
    const node = NodeFactory.createNode(
      makeNodeBuilder('debug', {})
    ) as DebugNode;
    const message: NodeMessage = {
      payload: {
        toto: 1,
        tata: 2,
        name: 'My name'
      }
    };
    const debugEvent = jest.fn();

    node.DebugEvent.on(debugEvent);
    await node.processNode(message);

    expect(debugEvent).toHaveBeenCalledTimes(1);
    expect(debugEvent).toHaveBeenCalledWith({
      log: { toto: 1, tata: 2, name: 'My name' },
      id: node.id
    });
  });

  it('Error node', async () => {
    const errorSpecifics = {
      output: 'property',
      propertyName: 'toto',
      closeAuto: true
    };

    const node = NodeFactory.createNode(
      makeNodeBuilder('error', errorSpecifics)
    ) as ErrorNode;

    const message: NodeMessage = {
      payload: {
        toto: 'this is indeed an error',
        tata: 2,
        name: 'My name'
      }
    };
    const errorEvent = jest.fn();

    node.ErrorEvent.on(errorEvent);
    await node.processNode(message);

    expect(errorEvent).toHaveBeenCalledTimes(1);
    expect(errorEvent).toHaveBeenCalledWith({
      id: node.id,
      log: 'this is indeed an error',
      closeAuto: true
    });
  });

  it('Inject Node', async () => {
    const specifics = {
      inject: true,
      repeat: 'no',
      properties: [
        {
          type: 'string',
          name: 'firstName',
          id: '',
          value: 'Hugo'
        },
        {
          type: 'number',
          name: 'age',
          id: '',
          value: 25
        }
      ]
    };
    const mockInputEvent = jest.fn();
    const node = NodeFactory.createNode(
      makeNodeBuilder('inject', specifics)
    ) as InjectNode;
    node.ProcessingBegin.on(mockInputEvent);
    const message: NodeMessage = {
      payload: {}
    };

    const response = await node.trigger({});

    expect(mockInputEvent).toHaveBeenCalledTimes(1);
    expect(mockInputEvent).toHaveBeenCalledWith({
      data: {
        age: 25,
        firstName: 'Hugo'
      },
      nodeId: 'ad411990-cbf6-49cb-a8ca-acb57917dab6'
    });
  });

  it('Delay Node - Fixed Delay', async () => {
    const specifics = {
      mode: 'fixed',
      delay: 500,
      unit: 'millisecond'
    };

    const node = NodeFactory.createNode(makeNodeBuilder('delay', specifics));

    const message: NodeMessage = { payload: 'Test Message' };

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    await node.processNode(message);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 500);
  });

  it('Delay Node - Random Interval', async () => {
    const specifics = {
      mode: 'random',
      delay: { min: 100, max: 500 },
      unit: 'millisecond'
    };

    const node = NodeFactory.createNode(makeNodeBuilder('delay', specifics));

    const message: NodeMessage = { payload: 'Test Message' };

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    await node.processNode(message);

    const setTimeoutDelay = setTimeoutSpy.mock.calls[0][1];

    expect(setTimeoutDelay).toBeGreaterThanOrEqual(100);
    expect(setTimeoutDelay).toBeLessThanOrEqual(500);
  });

  it('Function Node', async () => {
    const specifics = {
      code: `
      const multiplier = msg.fields[0].value * msg.fields[0].value;
      const res = { ...msg, multiplier };
      return res;
      `
    };

    const node = NodeFactory.createNode(makeNodeBuilder('function', specifics));

    const message: NodeMessage = {
      payload: {
        fields: [{ value: 5 }]
      }
    };

    const res = await node.processNode(message);
    expect(res?.payload).toStrictEqual({
      fields: [{ value: 5 }],
      multiplier: 25
    });
  });

  it('Switch Node 2C 2OK', async () => {
    const specifics = {
      propertyName: 'toto',
      switchFields: [
        {
          type: 'number',
          operator: '>',
          value: 140,
          id: ''
        },
        {
          type: 'number',
          operator: '<',
          value: 180,
          id: ''
        }
      ],
      switchMode: 'continue'
    };

    const node = NodeFactory.createNode(makeNodeBuilder('switch', specifics));
    const message: NodeMessage = {
      payload: {
        toto: 150
      }
    };
    const nodeOutput = await node.processNode(message);
    expect(nodeOutput).toBeDefined();
    expect(nodeOutput?.outputHandles).toStrictEqual(['output-0', 'output-1']);
  });

  it('Switch Node 2C 1OK', async () => {
    const specifics = {
      propertyName: 'toto',
      switchFields: [
        {
          type: 'number',
          operator: '>',
          value: 140,
          id: ''
        },
        {
          type: 'number',
          operator: '<',
          value: 180,
          id: ''
        }
      ],
      switchMode: 'continue'
    };

    const node = NodeFactory.createNode(makeNodeBuilder('switch', specifics));
    const message: NodeMessage = {
      payload: {
        toto: 0
      }
    };
    const nodeOutput = await node.processNode(message);
    expect(nodeOutput).toBeDefined();
    expect(nodeOutput?.outputHandles).toStrictEqual(['output-1']);
  });

  it('Switch Node 2C 1KO stop', async () => {
    const specifics = {
      propertyName: 'toto',
      switchFields: [
        {
          type: 'number',
          operator: '>',
          value: 140,
          id: ''
        },
        {
          type: 'number',
          operator: '<',
          value: 180,
          id: ''
        }
      ],
      switchMode: 'stop'
    };

    const node = NodeFactory.createNode(makeNodeBuilder('switch', specifics));
    const message: NodeMessage = {
      payload: {
        toto: 0
      }
    };
    const nodeOutput = await node.processNode(message);
    expect(nodeOutput).toBeDefined();
    expect(nodeOutput?.outputHandles).toStrictEqual(['output-1']);
  });

  it('Filter node block', async () => {
    const specifics = {
      propertyName: 'count',
      mode: 'block'
    };

    const node = NodeFactory.createNode(makeNodeBuilder('filter', specifics));
    const nodeNext = NodeFactory.createNode(makeNodeBuilder('debug', {}));
    node.nextNodes['output-0'] = [nodeNext];
    const message: NodeMessage = {
      payload: {
        name: 'hugo',
        count: 4
      }
    };

    const res1 = await node.processNode(message);
    expect(res1?.payload).toStrictEqual(message.payload);
    expect(res1?.outputHandles).toStrictEqual(['output-0']);

    const res2 = await node.processNode(message);
    expect(res2?.payload).toStrictEqual(message.payload);
    expect(res2?.outputHandles).toStrictEqual([]);

    const messageNotSoDifferent: NodeMessage = {
      payload: {
        name: 'hugo P',
        count: 4
      }
    };

    const res3 = await node.processNode(messageNotSoDifferent);
    expect(res3?.payload).toStrictEqual(messageNotSoDifferent.payload);
    expect(res3?.outputHandles).toStrictEqual([]);

    const messageDifferent: NodeMessage = {
      payload: {
        name: 'hugo P',
        count: 444
      }
    };
    const res4 = await node.processNode(messageDifferent);
    expect(res4?.payload).toStrictEqual(messageDifferent.payload);
    expect(res4?.outputHandles).toStrictEqual(['output-0']);
  });

  it('Filter block until greater', async () => {
    const specifics = {
      propertyName: 'count',
      mode: 'blockUnlessGreater',
      value: {
        type: 'latestValid',
        value: 50
      }
    };

    const node = NodeFactory.createNode(makeNodeBuilder('filter', specifics));
    const nodeNext = NodeFactory.createNode(makeNodeBuilder('debug', {}));
    node.nextNodes['output-0'] = [nodeNext];
    const message: NodeMessage = {
      payload: {
        name: 'hugo',
        count: 4
      }
    };

    const res1 = await node.processNode(message);
    expect(res1?.payload).toStrictEqual(message.payload);
    expect(res1?.outputHandles).toStrictEqual(['output-0']);

    const res2 = await node.processNode(message);
    expect(res2?.payload).toStrictEqual(message.payload);
    expect(res2?.outputHandles).toStrictEqual([]);

    const messageGreaterButStillInvalid: NodeMessage = {
      payload: {
        name: 'hugo P',
        count: 40
      }
    };
    const res3 = await node.processNode(messageGreaterButStillInvalid);
    expect(res3?.payload).toStrictEqual(messageGreaterButStillInvalid.payload);
    expect(res3?.outputHandles).toStrictEqual([]);

    const messageGreater: NodeMessage = {
      payload: {
        name: 'hugo P',
        count: 444
      }
    };
    const res4 = await node.processNode(messageGreater);
    expect(res4?.payload).toStrictEqual(messageGreater.payload);
    expect(res4?.outputHandles).toStrictEqual(['output-0']);
  });

  it('Filter block until lower', async () => {
    const specifics = {
      propertyName: 'count',
      mode: 'blockUnlessLower',
      value: {
        type: 'latest',
        value: -10
      }
    };

    const node = NodeFactory.createNode(makeNodeBuilder('filter', specifics));
    const nodeNext = NodeFactory.createNode(makeNodeBuilder('debug', {}));
    node.nextNodes['output-0'] = [nodeNext];
    const message: NodeMessage = {
      payload: {
        name: 'hugo',
        count: 4
      }
    };

    const res1 = await node.processNode(message);
    expect(res1?.payload).toStrictEqual(message.payload);
    expect(res1?.outputHandles).toStrictEqual(['output-0']);

    const res2 = await node.processNode(message);
    expect(res2?.payload).toStrictEqual(message.payload);
    expect(res2?.outputHandles).toStrictEqual([]);

    const messageLowerButStillInvalid: NodeMessage = {
      payload: {
        name: 'hugo P',
        count: 0
      }
    };
    const res3 = await node.processNode(messageLowerButStillInvalid);
    expect(res3?.payload).toStrictEqual(messageLowerButStillInvalid.payload);
    expect(res3?.outputHandles).toStrictEqual([]);

    const messageEvenLowerButStillInvalid: NodeMessage = {
      payload: {
        name: 'hugo P',
        count: -9
      }
    };
    const res4 = await node.processNode(messageEvenLowerButStillInvalid);
    expect(res4?.payload).toStrictEqual(
      messageEvenLowerButStillInvalid.payload
    );
    expect(res4?.outputHandles).toStrictEqual([]);

    const messageLowerAndValid: NodeMessage = {
      payload: {
        name: 'hugo P',
        count: -21
      }
    };
    const res5 = await node.processNode(messageLowerAndValid);
    expect(res5?.payload).toStrictEqual(messageLowerAndValid.payload);
    expect(res5?.outputHandles).toStrictEqual(['output-0']);
  });

  it('Scale node scale', async () => {
    const specifics = {
      propertyName: 'value',
      mode: 'scale',
      inputScale: {
        from: 0,
        to: 10
      },
      outputScale: {
        from: 0,
        to: 100
      },
      round: false
    };

    const message: NodeMessage = {
      payload: {
        name: 'Hugo',
        value: 5
      }
    };

    const node = NodeFactory.createNode(makeNodeBuilder('range', specifics));
    const res = await node.processNode(message);

    expect(res?.payload.value).toBe(50);
    expect(res?.payload.name).toBe('Hugo');
  });

  it('Scale node scale with limits', async () => {
    const specifics = {
      propertyName: 'value',
      mode: 'scaleAndLimit',
      inputScale: {
        from: 12,
        to: 10
      },
      outputScale: {
        from: 0,
        to: 100
      },
      round: false
    };

    const message: NodeMessage = {
      payload: {
        name: 'Hugo',
        value: 5
      }
    };

    const node = NodeFactory.createNode(makeNodeBuilder('range', specifics));
    const res = await node.processNode(message);

    expect(res?.payload.value).toBe(100);
    expect(res?.payload.name).toBe('Hugo');
  });

  it('Template node', async () => {
    const specifics = {
      propertyName: 'sentence',
      template: 'Salut {{name}}, tu as {{age}}, c\'est bien ca ?'
    };

    const message: NodeMessage = {
      payload: {
        name: 'Hugo',
        age: 5,
        value: 'toto'
      }
    };

    const node = NodeFactory.createNode(makeNodeBuilder('template', specifics));
    const res = await node.processNode(message);

    expect(res?.payload.name).toBe('Hugo');
    expect(res?.payload.value).toBe('toto');
    expect(res?.payload.age).toBe(5);
    expect(res?.payload.sentence).toBe('Salut Hugo, tu as 5, c\'est bien ca ?');
  });
});
