import { NeutronGraphError } from '../neutron/core/errors/NeutronGraphError';
import { NodeMessage } from '../neutron/core/nodes/INeutronNode';
import { ConnectorGraph } from '../neutron/core/nodes/implementation/graphs/ConnectorGraph';
import { FlowGraph } from '../neutron/core/nodes/implementation/graphs/FlowGraph';
import { DebugNode } from '../neutron/core/nodes/implementation/nodes/functions/DebugNode';
import { graphTemplate } from './__mixture__/connectorGraphMock';
import { flowGraphMock } from './__mixture__/flowGraphMock';
import { sleep } from '../neutron/utils/time';
import { PublisherNode } from '../neutron/core/nodes/implementation/nodes';
import { RosContext, RosContextConfiguration } from '../neutron/core/network/RosContext';
import BaseControllerGraphMock from './__mixture__/baseControllerGraphMock';

jest.mock('../neutron/core/network/makeContext');
jest.mock('roslib');

describe('Nodes graph builder', () => {
  const edgesDb = graphTemplate.edges;
  const nodesDb = graphTemplate.nodes;

  it('build connector graph successfuly', () => {
    const graph = new ConnectorGraph(nodesDb, edgesDb);

    expect((graph as any).inputNode.id).toBe(
      'bb6e7ae5-69d6-4822-8803-d66e18255f73'
    );
    expect(graph.nodeCount).toBe(7);

    const switchNode = graph.getNodeById(
      '2e8704ee-7e4c-4a4d-85f5-aed87b27ef40'
    );
    expect(switchNode).toBeDefined();
    expect(Object.entries(switchNode?.nextNodes ?? []).length).toBe(2);

    const lastDebugNode = graph.getNodeById(
      '663463fb-5dab-4a37-8521-c24dc73db9cc'
    );
    expect(lastDebugNode).toBeDefined();
    expect(Object.entries(lastDebugNode?.nextNodes ?? []).length).toBe(0);
  });

  it('Fails to build a graph with broken dependencies', () => {
    let error: any = null;

    const wrongNodesDb = nodesDb.filter(
      e => e.id !== '34095948-8fc8-4286-b4ad-886a0e58277b'
    );
    try {
      const graph = new ConnectorGraph(wrongNodesDb, edgesDb);
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(NeutronGraphError);
    expect(error.message).toBe(
      'No node with id 34095948-8fc8-4286-b4ad-886a0e58277b has been provided'
    );
  });

  it('Fails to build the graph because it is cyclic', async () => {
    let error: any = null;

    const freshEdges = edgesDb.map((edge, index) => (index === 5 ? { ...edge, target: '396748fb-c7f3-4d07-a649-49cce5fc03bd' } : edge));

    try {
      const graph = new ConnectorGraph(nodesDb, freshEdges);
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(NeutronGraphError);
    expect(error.message).toBe(
      'A cycle has been detected while building the graph'
    );
  });
  it('Failed to build the graph because of a unknown node type', async () => {
    const unknownNodes = nodesDb.map(node => ({ ...node, data: { ...node.data, name: 'ThisNodeDoesNotExist' } }));

    let error: any = null;

    try {
      const graph = new ConnectorGraph(unknownNodes, edgesDb);
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(NeutronGraphError);
    expect(error.message).toBe(
      'Failed to build the graph, unknown node ThisNodeDoesNotExist'
    );
  });

  it('Use a ros context', async () => {
    const config: RosContextConfiguration = {
      hostname: 'localhost',
      port: 9090,
      clientId: 'test'
    };

    const context = new RosContext(config);

    const modifiedNode = {
      ...nodesDb[6],
      data: {
        ...nodesDb[6].data,
        name: 'publisher',
        specifics: {
          topic: {
            name: 'topic',
            messageType: 'messageType'
          }
        } as any
      }
    };

    const modfiedNodes = nodesDb.map(e => (e.id === modifiedNode.id ? modifiedNode : e));
    const graph = new ConnectorGraph(modfiedNodes, edgesDb);
    graph.useContext(context);

    const rosNode = graph.getNodeById<PublisherNode>('663463fb-5dab-4a37-8521-c24dc73db9cc');
    expect((rosNode as any).rosContext).toBeDefined();
  });
});

describe('Nodes graph execution', () => {
  const edgesDb = graphTemplate.edges;
  const nodesDb = graphTemplate.nodes;

  it('Trigger a controller node', async () => {
    const graph = new ConnectorGraph(nodesDb, edgesDb);
    const mockNodeProcessEvent = jest.fn();
    const mockLastDebugNode0AfterEvent = jest.fn();
    const mockLastDebugNode1AfterEvent = jest.fn();
    const mockLastDebugNode2AfterEvent = jest.fn();

    graph.NodeProcessEvent.on(event => {
      mockNodeProcessEvent(event);
    });
    const message: NodeMessage = {
      payload: {
        speed: 0.5,
        rotation: 15
      }
    };

    const debugNode0 = graph.getNodeById<DebugNode>(
      'a560d355-ba9b-43d1-bdd2-8235a45dfb52'
    );
    debugNode0?.AfterProcessingEvent.on(mockLastDebugNode0AfterEvent);

    const debugNode1 = graph.getNodeById<DebugNode>(
      '663463fb-5dab-4a37-8521-c24dc73db9cc'
    );
    debugNode1?.AfterProcessingEvent.on(mockLastDebugNode1AfterEvent);

    const debugNode2 = graph.getNodeById<DebugNode>(
      'f63a4e90-ecb2-44c9-ac39-d9c8d2bca971'
    );
    debugNode2?.AfterProcessingEvent.on(mockLastDebugNode2AfterEvent);

    await graph.runInputNode(undefined, message);

    expect(mockLastDebugNode0AfterEvent).toHaveBeenCalled();
    expect(mockLastDebugNode1AfterEvent).toHaveBeenCalled();
    expect(mockLastDebugNode2AfterEvent).not.toHaveBeenCalled();
    expect(mockNodeProcessEvent).toHaveBeenCalledTimes(12);
  });
});

describe('Nodes Flow builder', () => {
  const edgesDb = flowGraphMock.edges;
  const nodesDb = flowGraphMock.nodes;
  const mockNodeDb = nodesDb[0];

  it('build flow graph successfuly', () => {
    const graph = new FlowGraph(nodesDb, edgesDb);

    expect(graph.nodeCount).toBe(5);

    const switchNode = graph.getNodeById(
      '19c60b31-d102-4eb8-b0e8-81c155011f18'
    );
    expect(switchNode).toBeDefined();
    expect(Object.entries(switchNode?.nextNodeToArray ?? []).length).toBe(2);

    const lastDebugNode = graph.getNodeById(
      'e121382e-caed-4cec-b81c-24c3f3083cc9'
    );
    expect(lastDebugNode).toBeDefined();
    expect(Object.entries(lastDebugNode?.nextNodeToArray ?? []).length).toBe(0);

    const functionNode = graph.getNodeById(
      '2be1d640-6a57-4bde-96c1-42df250de733'
    );
    expect(functionNode).toBeDefined();
    const functionNodeLooped = functionNode?.nextNodeToArray[0].node.nextNodeToArray[0].node
      .nextNodeToArray[0].node;

    expect(functionNodeLooped).toBeDefined();
    expect(functionNodeLooped?.id).toBe(functionNode?.id);

    const debugNodes = graph.findNodeByType<DebugNode>(DebugNode);
    expect(debugNodes.length).toBe(1);
    expect(debugNodes[0].id).toBe('e121382e-caed-4cec-b81c-24c3f3083cc9');
  });

  it('Failed to build the graph because of a unknown node type', async () => {
    const unknownNodes = nodesDb.map((node, id) => (id === 0
      ? {
        ...node,
        data: {
          ...node.data,
          name: 'ThisNodeDoesNotExist'
        }
      }
      : node));

    let error: any = null;

    try {
      const graph = new FlowGraph(unknownNodes, edgesDb);
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(NeutronGraphError);
    expect(error.message).toBe(
      'Failed to build the graph, unknown node ThisNodeDoesNotExist'
    );
  });
});

describe('Neutron flow execution', () => {
  const edgesDb = flowGraphMock.edges;
  const nodesDb = flowGraphMock.nodes;
  const mockNodeDb = nodesDb[0];

  it('run flow graph', async () => {
    const graph = new FlowGraph(nodesDb, edgesDb);

    const onDelayNodeProcessed = jest.fn();
    const delayNode = graph.getNodeById('f9998a91-ce0a-48e0-aa68-fdc028b46e3a');
    delayNode?.AfterProcessingEvent.on(onDelayNodeProcessed);

    const onDebugNodeProcessed = jest.fn();
    const debugNode = graph.getNodeById<DebugNode>(
      'e121382e-caed-4cec-b81c-24c3f3083cc9'
    );
    debugNode?.DebugEvent.on(onDebugNodeProcessed);

    const res = await graph.runInputNode(
      'ad411990-cbf6-49cb-a8ca-acb57917dab6'
    );

    expect(onDelayNodeProcessed).toHaveBeenCalledTimes(9);
    expect(onDebugNodeProcessed).toHaveBeenCalledTimes(1);
  }, 5000);

  it('run and stop flow graph', async () => {
    const graph = new FlowGraph(nodesDb, edgesDb);

    const onDelayNodeProcessed = jest.fn();
    const delayNode = graph.getNodeById('f9998a91-ce0a-48e0-aa68-fdc028b46e3a');
    delayNode?.AfterProcessingEvent.on(onDelayNodeProcessed);

    const onDebugNodeProcessed = jest.fn();
    const debugNode = graph.getNodeById<DebugNode>(
      'e121382e-caed-4cec-b81c-24c3f3083cc9'
    );
    debugNode?.DebugEvent.on(onDebugNodeProcessed);

    const promise = graph.runInputNode('ad411990-cbf6-49cb-a8ca-acb57917dab6');

    await sleep(350);

    graph.stopExecution();

    await promise;

    expect(onDelayNodeProcessed).toHaveBeenCalledTimes(4);
    expect(onDebugNodeProcessed).toHaveBeenCalledTimes(0);
  });
});

describe('Diverse graph executions', () => {
  it('Run Base Controller graph use case', async () => {
    const graph = new ConnectorGraph(BaseControllerGraphMock.nodes, BaseControllerGraphMock.edges);

    const message = {
      payload: {
        speed: 30,
        x: 0,
        y: 0
      }
    };

    const stopDebugNodeCb = jest.fn();
    const stopDebugNode = graph.getNodeById('4ce6e20b-fbfd-49b0-a4c8-876b8d4fa775');
    stopDebugNode?.AfterProcessingEvent.once(stopDebugNodeCb);

    await graph.runInputNode('a1c45a3c-534d-4973-84e2-898197c03935', message);

    // todo: fix this test
    // expect(stopDebugNodeCb).toHaveBeenCalledTimes(1);
    // expect(stopDebugNodeCb).toHaveBeenCalledWith({});
  });
});
