import NeutronNodeGraph from "../neutron/core/node/NeutronGraphNode";
import { complexEdges, complexNodes } from "./__mixture__/nodes";

describe("Nodes", () => {
  it("build basic nodegraph", () => {
    const graph = new NeutronNodeGraph(complexNodes, complexEdges);

    expect(graph.inputNode.id).toBe("325bab26-7d75-442e-85f2-4dd328d4f146");
    expect(Object.entries(graph.inputNode.outputHandles).length).toBe(4);

    const endNode =
      graph.inputNode.outputHandles["top"].targets[0].node.outputHandles[
        "output-true-7d1502ee-a7af-4504-998d-997fcef0ced0"
      ].targets[0].node.outputHandles["result"].targets[0].node;

    expect(endNode.id).toBe("aaf1b1c6-bf43-4bcf-bf4b-e354e9316583");
    expect(Object.values(endNode.inputHandles).length).toBe(2);
    expect(graph.nodes.length).toBe(10);
  });

  it.todo("Triggers a publisher node");

  it.todo("build complex nodegraph");

  it.todo("fails to build nodegraph because no input node");

  it.todo("fails to build nodegraph because it cycles");

  it.todo("fails to build nodegraph because it cycles");
});
