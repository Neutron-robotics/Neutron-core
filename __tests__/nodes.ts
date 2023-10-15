import NeutronNodeGraph from "../neutron/core/node/NeutronGraphNode";
import BaseControllerNode from "../neutron/core/node/implementation/BaseControllerNode";
import IfNode from "../neutron/core/node/implementation/IfNode";
import PublisherNode from "../neutron/core/node/implementation/PublisherNode";
import SubscriberNode from "../neutron/core/node/implementation/SubscriberNode";
import {
  brokenLinkEdges,
  brokenLinkNodes,
  complexEdges,
  complexNodes,
  cyclicEdges,
  cyclicNode,
} from "./__mixture__/nodes";
import NeutronGraphError from "../neutron/core/errors/NeutronGraphError";
import _ from "lodash";
import { ILiteEvent } from "../dist";

describe("Nodes graph builder", () => {
  it("build basic nodegraph successfuly", () => {
    const graph = new NeutronNodeGraph(complexNodes, complexEdges);

    expect(graph.inputNode.id).toBe("325bab26-7d75-442e-85f2-4dd328d4f146");
    expect(Object.entries(graph.inputNode.outputHandles).length).toBe(4);

    const endNode =
      graph.inputNode.outputHandles["top"].targets[0].node.outputHandles[
        "nodeOutput"
      ].targets[0].node.outputHandles["nodeOutput"].targets[0].node;

    expect(endNode.id).toBe("aaf1b1c6-bf43-4bcf-bf4b-e354e9316583");
    expect(Object.values(endNode.inputHandles).length).toBe(2);
    expect(graph.nodes.length).toBe(10);
  });

  it("Get a node by id", () => {
    const graph = new NeutronNodeGraph(complexNodes, complexEdges);

    const controllerNode = graph.getNode<BaseControllerNode>(
      "325bab26-7d75-442e-85f2-4dd328d4f146"
    );
    const ifNode = graph.getNode<IfNode>(
      "3059327c-ca55-4c21-9486-ed2e3e46cd85"
    );
    const publisherNode = graph.getNode<PublisherNode<any>>(
      "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583"
    );
    const subscriberNode = graph.getNode<SubscriberNode>(
      "aaf1b1c6-n0op-4bcf-bf4b-e354e9316583"
    );

    expect(controllerNode).toBeDefined();
    expect(ifNode).toBeDefined();
    expect(publisherNode).toBeDefined();
    expect(subscriberNode).not.toBeDefined();
  });

  it("Fails to build a graph with broken links", () => {
    let error: any = null;
    try {
      const graph = new NeutronNodeGraph(brokenLinkNodes, brokenLinkEdges);
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(NeutronGraphError);
    expect(error.message).toBe(
      "The node 3059327c-ca55-4c21-9486-ed2e3e46cd85 defined by edge reactflow__edge-325bab26-7d75-442e-85f2-4dd328d4f146top-3059327c-ca55-4c21-9486-ed2e3e46cd85input-7d1502ee-a7af-4504-998d-997fcef0ced0 could not be found while building graph"
    );
    expect(error.name).toBe("NeutronGraphError");
  });

  it("Fails to build the graph because no input node", () => {
    const brokenNodeWithNoInput = brokenLinkNodes.filter((e) => !e.isInput);
    let error: any = null;

    try {
      const graph = new NeutronNodeGraph(
        brokenNodeWithNoInput,
        brokenLinkEdges
      );
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(NeutronGraphError);
    expect(error.message).toBe("No input node has been provided");
    expect(error.name).toBe("NeutronGraphError");
  });

  it("Fails to build the graph because it is cyclic", () => {
    const brokenNodeWithNoInput = brokenLinkNodes.filter((e) => !e.isInput);
    let error: any = null;

    try {
      const graph = new NeutronNodeGraph(cyclicNode, cyclicEdges);
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(NeutronGraphError);
    expect(error.message).toBe(
      "A cycle has been detected while building the graph"
    );
    expect(error.name).toBe("NeutronGraphError");
  });

  it("Failed to build the graph because of a unknown node type", () => {
    const nodeIncludingForeign = _.cloneDeep(complexNodes);

    nodeIncludingForeign[0].type = "inevermetthisnodeNode";
    let error: any = null;

    try {
      const graph = new NeutronNodeGraph(nodeIncludingForeign, complexEdges);
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(NeutronGraphError);
    expect(error.message).toBe("Type inevermetthisnodeNode is not implemented");
    expect(error.name).toBe("NeutronGraphError");
  });

  it.todo("build complex nodegraph");
});

describe("Nodegraph execution", () => {
  const makeWaitForGraphToProcess = (event: ILiteEvent<any>) =>
    new Promise((res) => {
      event.once(() => res({}));
    });

  it("Triggers a controller node", async () => {
    const graph = new NeutronNodeGraph(complexNodes, complexEdges);
    const publisherNodeCallback = jest.fn();

    const controllerNode = graph.getNode<BaseControllerNode>(
      "325bab26-7d75-442e-85f2-4dd328d4f146"
    );
    const publisherNode = graph.getNode<PublisherNode<any>>(
      "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583"
    );
    publisherNode?.BeforeProcessingEvent.on(publisherNodeCallback);

    const waitForGraphToProcess = new Promise((res) => {
      publisherNode?.AfterProcessingEvent.once(() => res({}));
    });

    controllerNode?.sendInput({
      top: 20,
      left: 15,
    });

    await waitForGraphToProcess;

    expect(publisherNodeCallback).toHaveBeenCalledTimes(1);
    expect(publisherNodeCallback).toHaveBeenCalledWith({
      data: {
        x: 20,
        yaw: 15,
      },
      nodeId: "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583",
    });
  }, 10000);

  it("Several graphnode execution (awaited)", async () => {
    const graph = new NeutronNodeGraph(complexNodes, complexEdges);
    const publisherNodeCallback = jest.fn();

    const controllerNode = graph.getNode<BaseControllerNode>(
      "325bab26-7d75-442e-85f2-4dd328d4f146"
    );
    const publisherNode = graph.getNode<PublisherNode<any>>(
      "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583"
    );

    if (!publisherNode) {
      throw new Error("No publisher node");
    }

    publisherNode.BeforeProcessingEvent.on(publisherNodeCallback);

    const firstExecutionPromise = makeWaitForGraphToProcess(
      publisherNode.AfterProcessingEvent
    );
    controllerNode?.sendInput({
      top: 20,
    });
    await firstExecutionPromise;
    expect(publisherNodeCallback).toHaveBeenCalledTimes(1);
    expect(publisherNodeCallback).toHaveBeenCalledWith({
      data: {
        x: 20,
        yaw: undefined,
      },
      nodeId: "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583",
    });

    // 2

    const publisherNodeCallback2 = jest.fn();
    publisherNode.BeforeProcessingEvent.once(publisherNodeCallback2);
    const secondExecutionPromise = makeWaitForGraphToProcess(
      publisherNode.AfterProcessingEvent
    );
    controllerNode?.sendInput({
      right: 90,
    });
    await secondExecutionPromise;
    expect(publisherNodeCallback2).toHaveBeenCalledTimes(1);
    expect(publisherNodeCallback2).toHaveBeenCalledWith({
      data: {
        x: undefined,
        yaw: 90,
      },
      nodeId: "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583",
    });

    // 3

    const publisherNodeCallback3 = jest.fn();
    publisherNode.BeforeProcessingEvent.once(publisherNodeCallback3);
    const thirdExecutionPromise = makeWaitForGraphToProcess(
      publisherNode.AfterProcessingEvent
    );
    controllerNode?.sendInput({
      left: 20,
      top: 10,
    });
    await thirdExecutionPromise;
    expect(publisherNodeCallback3).toHaveBeenCalledTimes(1);
    expect(publisherNodeCallback3).toHaveBeenCalledWith({
      data: {
        x: 10,
        yaw: 20,
      },
      nodeId: "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583",
    });
  }, 10000);

  it("Several graph execution (in a row)", async () => {
    const graph = new NeutronNodeGraph(complexNodes, complexEdges);
    const publisherNodeCallback = jest.fn();

    const controllerNode = graph.getNode<BaseControllerNode>(
      "325bab26-7d75-442e-85f2-4dd328d4f146"
    );
    const publisherNode = graph.getNode<PublisherNode<any>>(
      "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583"
    );

    if (!publisherNode) {
      throw new Error("No publisher node");
    }

    const publisherNodeRun = jest.fn();
    publisherNode.BeforeProcessingEvent.on(publisherNodeRun);

    controllerNode?.sendInput({
      left: 20,
      top: 10,
    });
    await graph.waitToProcess();
    controllerNode?.sendInput({
      right: 90,
    });
    await graph.waitToProcess();
    controllerNode?.sendInput({
      top: 20,
      left: 15,
    });
    await graph.waitToProcess();

    expect(publisherNodeRun).toHaveBeenCalledTimes(3);
    expect(publisherNodeRun).toHaveBeenCalledWith({
      data: {
        x: 10,
        yaw: 20,
      },
      nodeId: "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583",
    });
    expect(publisherNodeRun).toHaveBeenCalledWith({
      data: {
        x: undefined,
        yaw: 90,
      },
      nodeId: "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583",
    });
    expect(publisherNodeRun).toHaveBeenCalledWith({
      data: {
        x: 20,
        yaw: 15,
      },
      nodeId: "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583",
    });
  }, 100000);
});
