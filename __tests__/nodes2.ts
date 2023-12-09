import NeutronGraphError from "../neutron/core/errors/NeutronGraphError";
import { NodeMessage } from "../neutron/core/nodes/INeutronNode";
import NodeFactory from "../neutron/core/nodes/NodeFactory";
import ConnectorGraph from "../neutron/core/nodes/implementation/graphs/ConnectorGraph";
import FlowGraph from "../neutron/core/nodes/implementation/graphs/FlowGraph";
import DebugNode from "../neutron/core/nodes/implementation/nodes/functions/DebugNode";
import ErrorNode from "../neutron/core/nodes/implementation/nodes/functions/ErrorNode";
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

  it("Change Node define a field", async () => {
    const specifics = {
      fields: [
        {
          id: "",
          mode: "define",
          inputField: "toto",
          targetField: "foo",
        },
      ],
    };

    const node = NodeFactory.createNode(makeNodeBuilder("change", specifics));
    const message: NodeMessage = {
      payload: {
        toto: 1,
      },
    };
    const response = await node.processNode(message);
    expect(response?.payload.foo).toBe(1);
    expect(response?.payload.toto).toBe(1);
  });

  it("Change Node remove a field", async () => {
    const specifics = {
      fields: [
        {
          id: "",
          mode: "remove",
          inputField: "toto",
        },
      ],
    };

    const node = NodeFactory.createNode(makeNodeBuilder("change", specifics));
    const message: NodeMessage = {
      payload: {
        toto: 1,
      },
    };
    const response = await node.processNode(message);
    expect(response?.payload.toto).not.toBeDefined();
  });

  it("Change Node move a field", async () => {
    const specifics = {
      fields: [
        {
          id: "",
          mode: "move",
          inputField: "toto",
          targetField: "foo",
        },
      ],
    };

    const node = NodeFactory.createNode(makeNodeBuilder("change", specifics));
    const message: NodeMessage = {
      payload: {
        toto: 1,
      },
    };
    const response = await node.processNode(message);
    expect(response?.payload.foo).toBe(1);
    expect(response?.payload.toto).not.toBeDefined();
  });

  it("Debug node", async () => {
    const node = NodeFactory.createNode(
      makeNodeBuilder("debug", {})
    ) as DebugNode;
    const message: NodeMessage = {
      payload: {
        toto: 1,
        tata: 2,
        name: "My name",
      },
    };
    const debugEvent = jest.fn();

    node.DebugEvent.on(debugEvent);
    await node.processNode(message);

    expect(debugEvent).toHaveBeenCalledTimes(1);
    expect(debugEvent).toHaveBeenCalledWith({
      log: '{"toto":1,"tata":2,"name":"My name"}',
    });
  });

  it("Error node", async () => {
    const errorSpecifics = {
      output: "property",
      propertyName: "toto",
      closeAuto: true,
    };

    const node = NodeFactory.createNode(
      makeNodeBuilder("error", errorSpecifics)
    ) as ErrorNode;

    const message: NodeMessage = {
      payload: {
        toto: "this is indeed an error",
        tata: 2,
        name: "My name",
      },
    };
    const errorEvent = jest.fn();

    node.ErrorEvent.on(errorEvent);
    await node.processNode(message);

    expect(errorEvent).toHaveBeenCalledTimes(1);
    expect(errorEvent).toHaveBeenCalledWith({
      log: "this is indeed an error",
      closeAuto: true,
    });
  });

  it("Inject Node", async () => {
    const specifics = {
      inject: true,
      repeat: "no",
      properties: [
        {
          type: "string",
          name: "firstName",
          id: "",
          value: "Hugo",
        },
        {
          type: "number",
          name: "age",
          id: "",
          value: 25,
        },
      ],
    };
    const node = NodeFactory.createNode(makeNodeBuilder("inject", specifics));
    const message: NodeMessage = {
      payload: {},
    };

    const response = await node.processNode(message);
    expect(response?.payload).toStrictEqual({
      firstName: "Hugo",
      age: 25,
    });
  });

  it("Delay Node - Fixed Delay", async () => {
    const specifics = {
      mode: "fixed",
      delay: 500,
      unit: "millisecond",
    };

    const node = NodeFactory.createNode(makeNodeBuilder("delay", specifics));

    const message: NodeMessage = { payload: "Test Message" };

    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    await node.processNode(message);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 500);
  });

  it("Delay Node - Random Interval", async () => {
    const specifics = {
      mode: "random",
      delay: { min: 100, max: 500 },
      unit: "millisecond",
    };

    const node = NodeFactory.createNode(makeNodeBuilder("delay", specifics));

    const message: NodeMessage = { payload: "Test Message" };

    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    await node.processNode(message);

    const setTimeoutDelay = setTimeoutSpy.mock.calls[0][1];

    expect(setTimeoutDelay).toBeGreaterThanOrEqual(100);
    expect(setTimeoutDelay).toBeLessThanOrEqual(500);
  });

  it("Function Node", async () => {
    const specifics = {
      code: `
      const multiplier = msg.payload.fields[0].value * msg.payload.fields[0].value;
      msg.payload.multiplier = multiplier;
      return msg;
      `,
    };

    const node = NodeFactory.createNode(makeNodeBuilder("function", specifics));

    const message: NodeMessage = {
      payload: {
        fields: [{ value: 5 }],
      },
    };

    const res = await node.processNode(message);
    expect(res?.payload).toStrictEqual({
      fields: [{ value: 5 }],
      multiplier: 25,
    });
  });

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

  it("Filter node block", async () => {
    const specifics = {
      propertyName: "count",
      mode: "block",
    };

    const node = NodeFactory.createNode(makeNodeBuilder("filter", specifics));
    const nodeNext = NodeFactory.createNode(makeNodeBuilder("debug", {}));
    node.nextNodes["output-0"] = [nodeNext];
    const message: NodeMessage = {
      payload: {
        name: "hugo",
        count: 4,
      },
    };

    const res1 = await node.processNode(message);
    expect(res1?.payload).toStrictEqual(message.payload);
    expect(res1?.outputHandles).toStrictEqual(["output-0"]);

    const res2 = await node.processNode(message);
    expect(res2?.payload).toStrictEqual(message.payload);
    expect(res2?.outputHandles).toStrictEqual([]);

    const messageNotSoDifferent: NodeMessage = {
      payload: {
        name: "hugo P",
        count: 4,
      },
    };

    const res3 = await node.processNode(messageNotSoDifferent);
    expect(res3?.payload).toStrictEqual(messageNotSoDifferent.payload);
    expect(res3?.outputHandles).toStrictEqual([]);

    const messageDifferent: NodeMessage = {
      payload: {
        name: "hugo P",
        count: 444,
      },
    };
    const res4 = await node.processNode(messageDifferent);
    expect(res4?.payload).toStrictEqual(messageDifferent.payload);
    expect(res4?.outputHandles).toStrictEqual(["output-0"]);
  });

  it("Filter block until greater", async () => {
    const specifics = {
      propertyName: "count",
      mode: "blockUnlessGreater",
      value: {
        type: "latestValid",
        value: 50,
      },
    };

    const node = NodeFactory.createNode(makeNodeBuilder("filter", specifics));
    const nodeNext = NodeFactory.createNode(makeNodeBuilder("debug", {}));
    node.nextNodes["output-0"] = [nodeNext];
    const message: NodeMessage = {
      payload: {
        name: "hugo",
        count: 4,
      },
    };

    const res1 = await node.processNode(message);
    expect(res1?.payload).toStrictEqual(message.payload);
    expect(res1?.outputHandles).toStrictEqual(["output-0"]);

    const res2 = await node.processNode(message);
    expect(res2?.payload).toStrictEqual(message.payload);
    expect(res2?.outputHandles).toStrictEqual([]);

    const messageGreaterButStillInvalid: NodeMessage = {
      payload: {
        name: "hugo P",
        count: 40,
      },
    };
    const res3 = await node.processNode(messageGreaterButStillInvalid);
    expect(res3?.payload).toStrictEqual(messageGreaterButStillInvalid.payload);
    expect(res3?.outputHandles).toStrictEqual([]);

    const messageGreater: NodeMessage = {
      payload: {
        name: "hugo P",
        count: 444,
      },
    };
    const res4 = await node.processNode(messageGreater);
    expect(res4?.payload).toStrictEqual(messageGreater.payload);
    expect(res4?.outputHandles).toStrictEqual(["output-0"]);
  });

  it("Filter block until lower", async () => {
    const specifics = {
      propertyName: "count",
      mode: "blockUnlessLower",
      value: {
        type: "latest",
        value: -10,
      },
    };

    const node = NodeFactory.createNode(makeNodeBuilder("filter", specifics));
    const nodeNext = NodeFactory.createNode(makeNodeBuilder("debug", {}));
    node.nextNodes["output-0"] = [nodeNext];
    const message: NodeMessage = {
      payload: {
        name: "hugo",
        count: 4,
      },
    };

    const res1 = await node.processNode(message);
    expect(res1?.payload).toStrictEqual(message.payload);
    expect(res1?.outputHandles).toStrictEqual(["output-0"]);

    const res2 = await node.processNode(message);
    expect(res2?.payload).toStrictEqual(message.payload);
    expect(res2?.outputHandles).toStrictEqual([]);

    const messageLowerButStillInvalid: NodeMessage = {
      payload: {
        name: "hugo P",
        count: 0,
      },
    };
    const res3 = await node.processNode(messageLowerButStillInvalid);
    expect(res3?.payload).toStrictEqual(messageLowerButStillInvalid.payload);
    expect(res3?.outputHandles).toStrictEqual([]);

    const messageEvenLowerButStillInvalid: NodeMessage = {
      payload: {
        name: "hugo P",
        count: -9,
      },
    };
    const res4 = await node.processNode(messageEvenLowerButStillInvalid);
    expect(res4?.payload).toStrictEqual(
      messageEvenLowerButStillInvalid.payload
    );
    expect(res4?.outputHandles).toStrictEqual([]);

    const messageLowerAndValid: NodeMessage = {
      payload: {
        name: "hugo P",
        count: -21,
      },
    };
    const res5 = await node.processNode(messageLowerAndValid);
    expect(res5?.payload).toStrictEqual(messageLowerAndValid.payload);
    expect(res5?.outputHandles).toStrictEqual(["output-0"]);
  });

  it("Scale node scale", async () => {
    const specifics = {
      propertyName: "value",
      mode: "scale",
      inputScale: {
        from: 0,
        to: 10,
      },
      outputScale: {
        from: 0,
        to: 100,
      },
      round: false,
    };

    const message: NodeMessage = {
      payload: {
        name: "Hugo",
        value: 5,
      },
    };

    const node = NodeFactory.createNode(makeNodeBuilder("range", specifics));
    const res = await node.processNode(message);

    expect(res?.payload.value).toBe(50);
    expect(res?.payload.name).toBe("Hugo");
  });

  it("Scale node scale with limits", async () => {
    const specifics = {
      propertyName: "value",
      mode: "scaleAndLimit",
      inputScale: {
        from: 12,
        to: 10,
      },
      outputScale: {
        from: 0,
        to: 100,
      },
      round: false,
    };

    const message: NodeMessage = {
      payload: {
        name: "Hugo",
        value: 5,
      },
    };

    const node = NodeFactory.createNode(makeNodeBuilder("range", specifics));
    const res = await node.processNode(message);

    expect(res?.payload.value).toBe(100);
    expect(res?.payload.name).toBe("Hugo");
  });

  it("Template node", async () => {
    const specifics = {
      propertyName: "sentence",
      template: "Salut {{name}}, tu as {{age}}, c'est bien ca ?",
    };

    const message: NodeMessage = {
      payload: {
        name: "Hugo",
        age: 5,
        value: "toto",
      },
    };

    const node = NodeFactory.createNode(makeNodeBuilder("template", specifics));
    const res = await node.processNode(message);

    expect(res?.payload.name).toBe("Hugo");
    expect(res?.payload.value).toBe("toto");
    expect(res?.payload.age).toBe(5);
    expect(res?.payload.sentence).toBe("Salut Hugo, tu as 5, c'est bien ca ?");
  });
});
