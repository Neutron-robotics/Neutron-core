import NeutronNodeGraph from "../neutron/core/node/NeutronGraphNode";
import { NodeExecutionStage } from "../neutron/core/node/NeutronNode";
import BaseControllerNode from "../neutron/core/node/implementation/BaseControllerNode";
import IfNode from "../neutron/core/node/implementation/IfNode";
import PublisherNode from "../neutron/core/node/implementation/PublisherNode";
import SubscriberNode from "../neutron/core/node/implementation/SubscriberNode";
import { sleep } from "../neutron/utils/time";
import { complexEdges, complexNodes } from "./__mixture__/nodes";

describe("Nodes", () => {
  it("build basic nodegraph", () => {
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

  it("Triggers a controller node", async () => {
    const graph = new NeutronNodeGraph(complexNodes, complexEdges);
    const publisherNodeCallback = jest.fn();

    const controllerNode = graph.getNode<BaseControllerNode>(
      "325bab26-7d75-442e-85f2-4dd328d4f146"
    );
    const publisherNode = graph.getNode<PublisherNode<any>>(
      "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583"
    );
    publisherNode?.executionStage.on(publisherNodeCallback);

    controllerNode?.sendInput({
      top: 20,
    });

    await sleep(100);
    expect(publisherNodeCallback).toHaveBeenCalled();
    expect(publisherNodeCallback).toHaveBeenCalledWith({
      event: NodeExecutionStage.Processed,
      nodeId: "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583",
    });

    // verify data callback
    // verify node processing order
  });

  it.todo("Several graphnode execution");

  it.todo("build complex nodegraph");

  it.todo("fails to build nodegraph because no input node");

  it.todo("fails to build nodegraph because it cycles");

  it.todo("fails to build nodegraph because it cycles");
});
