import NeutronGraphError from "../neutron/core/errors/NeutronGraphError";
import { NodeMessage } from "../neutron/core/node2/INeutronNode";
import NodeFactory from "../neutron/core/node2/NodeFactory";
import ConnectorGraph from "../neutron/core/node2/implementation/graphs/ConnectorGraph";
import FlowGraph from "../neutron/core/node2/implementation/graphs/FlowGraph";
import DebugNode from "../neutron/core/node2/implementation/nodes/DebugNode";
import { graphTemplate } from "./__mixture__/connectorGraphMock";
import { flowGraphMock } from "./__mixture__/flowGraphMock";
jest.mock("../neutron/context/makeContext");

describe("Nodes graph builder", () => {
  const edgesDb = graphTemplate.edges;
  const nodesDb = graphTemplate.nodes;

  it("build connector graph successfuly", () => {
    const graph = new ConnectorGraph(nodesDb, edgesDb);

    expect((graph as any).inputNode.id).toBe(
      "bb6e7ae5-69d6-4822-8803-d66e18255f73"
    );
    expect(graph.nodeCount).toBe(7);

    const switchNode = graph.getNodeById(
      "2e8704ee-7e4c-4a4d-85f5-aed87b27ef40"
    );
    expect(switchNode).toBeDefined();
    expect(Object.entries(switchNode?.nextNodes ?? []).length).toBe(1);

    const lastDebugNode = graph.getNodeById(
      "663463fb-5dab-4a37-8521-c24dc73db9cc"
    );
    expect(lastDebugNode).toBeDefined();
    expect(Object.entries(lastDebugNode?.nextNodes ?? []).length).toBe(0);
  });

  it("Fails to build a graph with broken dependencies", () => {
    let error: any = null;

    const wrongNodesDb = nodesDb.filter(
      (e) => e.id !== "34095948-8fc8-4286-b4ad-886a0e58277b"
    );
    try {
      const graph = new ConnectorGraph(wrongNodesDb, edgesDb);
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(NeutronGraphError);
    expect(error.message).toBe(
      "No node with id 34095948-8fc8-4286-b4ad-886a0e58277b has been provided"
    );
  });

  it.todo("Fails to build the graph because it is cyclic");

  it.todo("Failed to build the graph because of a unknown node type");
});

describe("Nodes graph execution", () => {
  const edgesDb = graphTemplate.edges;
  const nodesDb = graphTemplate.nodes;

  it("Trigger a controller node", async () => {
    const graph = new ConnectorGraph(nodesDb, edgesDb);
    const mockNodeProcessEvent = jest.fn();
    const mockLastDebugNodeAfterEvent = jest.fn();

    graph.NodeProcessEvent.on((event) => {
      mockNodeProcessEvent(event);
    });
    const message: NodeMessage = {
      payload: {
        speed: 0.5,
        rotation: 15,
      },
    };

    const controllerNode = graph.getNodeById<DebugNode>(
      "663463fb-5dab-4a37-8521-c24dc73db9cc"
    );
    controllerNode?.AfterProcessingEvent.on((handler) => {
      mockLastDebugNodeAfterEvent(handler);
    });

    await graph.runInputNode(message);

    expect(mockLastDebugNodeAfterEvent).toHaveBeenCalled();
    expect(mockNodeProcessEvent).toHaveBeenCalledTimes(7);
  });
});

describe("Nodes Flow builder", () => {
  const edgesDb = flowGraphMock.edges;
  const nodesDb = flowGraphMock.nodes;
  const mockNodeDb = nodesDb[0];

  it("build flow graph successfuly", () => {
    const graph = new FlowGraph(nodesDb, edgesDb);

    expect(graph.nodeCount).toBe(5);

    const switchNode = graph.getNodeById(
      "19c60b31-d102-4eb8-b0e8-81c155011f18"
    );
    expect(switchNode).toBeDefined();
    expect(Object.entries(switchNode?.nextNodeToArray ?? []).length).toBe(2);

    const lastDebugNode = graph.getNodeById(
      "e121382e-caed-4cec-b81c-24c3f3083cc9"
    );
    expect(lastDebugNode).toBeDefined();
    expect(Object.entries(lastDebugNode?.nextNodeToArray ?? []).length).toBe(0);

    const functionNode = graph.getNodeById(
      "2be1d640-6a57-4bde-96c1-42df250de733"
    );
    expect(functionNode).toBeDefined();
    const functionNodeLooped =
      functionNode?.nextNodeToArray[0].node.nextNodeToArray[0].node
        .nextNodeToArray[0].node;

    expect(functionNodeLooped).toBeDefined();
    expect(functionNodeLooped?.id).toBe(functionNode?.id);
  });
});

describe("Neutron Nodes", () => {
  const mockNodeDb = flowGraphMock.nodes[0];

  const makeNodeBuilder = (type: string, specifics: any) => ({
    ...mockNodeDb,
    data: { ...mockNodeDb.data, name: type, specifics },
  });

  it.todo("Change Node");
  it.todo("Debug Node");
  it("Delay Node - Fixed Delay", async () => {
    const specifics = {
      mode: "fixed",
      delay: 500,
      unit: "millisecond",
    };

    const node = NodeFactory.createNode(makeNodeBuilder("delay", specifics));

    // Mock NodeMessage
    const message: NodeMessage = { payload: "Test Message" };

    // Spy on setTimeout
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    // Test the process method
    await node.processNode(message);

    // Assert that setTimeout was called with the correct delay
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 500);
  });

  it("Delay Node - Random Interval", async () => {
    const specifics = {
      mode: "random",
      delay: { min: 100, max: 500 },
      unit: "millisecond",
    };

    const node = NodeFactory.createNode(makeNodeBuilder("delay", specifics));

    // Mock NodeMessage
    const message: NodeMessage = { payload: "Test Message" };

    // Spy on setTimeout
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    // Test the process method
    await node.processNode(message);

    // Get the delay value passed to setTimeout
    const setTimeoutDelay = setTimeoutSpy.mock.calls[0][1];

    // Assert that setTimeout was called with a delay within the specified range
    expect(setTimeoutDelay).toBeGreaterThanOrEqual(100);
    expect(setTimeoutDelay).toBeLessThanOrEqual(500);
  });

  it.todo("Function Node");
  it.todo("Inject Node");

  it("Switch Node 2C 2OK", async () => {
    const specifics = {
      propertyName: "toto",
      switchFields: [
        {
          type: "number",
          operator: ">",
          value: 140,
          id: "",
        },
        {
          type: "number",
          operator: "<",
          value: 180,
          id: "",
        },
      ],
      switchMode: "continue",
    };

    const node = NodeFactory.createNode(makeNodeBuilder("switch", specifics));
    const message: NodeMessage = {
      payload: {
        toto: 150,
      },
    };
    const nodeOutput = await node.processNode(message);
    expect(nodeOutput).toBeDefined();
    expect(nodeOutput?.outputHandles).toStrictEqual(["output-0", "output-1"]);
  });

  it("Switch Node 2C 1OK", async () => {
    const specifics = {
      propertyName: "toto",
      switchFields: [
        {
          type: "number",
          operator: ">",
          value: 140,
          id: "",
        },
        {
          type: "number",
          operator: "<",
          value: 180,
          id: "",
        },
      ],
      switchMode: "continue",
    };

    const node = NodeFactory.createNode(makeNodeBuilder("switch", specifics));
    const message: NodeMessage = {
      payload: {
        toto: 0,
      },
    };
    const nodeOutput = await node.processNode(message);
    expect(nodeOutput).toBeDefined();
    expect(nodeOutput?.outputHandles).toStrictEqual(["output-1"]);
  });

  it("Switch Node 2C 1KO stop", async () => {
    const specifics = {
      propertyName: "toto",
      switchFields: [
        {
          type: "number",
          operator: ">",
          value: 140,
          id: "",
        },
        {
          type: "number",
          operator: "<",
          value: 180,
          id: "",
        },
      ],
      switchMode: "stop",
    };

    const node = NodeFactory.createNode(makeNodeBuilder("switch", specifics));
    const message: NodeMessage = {
      payload: {
        toto: 0,
      },
    };
    const nodeOutput = await node.processNode(message);
    expect(nodeOutput).toBeDefined();
    expect(nodeOutput?.outputHandles).toStrictEqual([]);
  });
});
