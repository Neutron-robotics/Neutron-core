import NeutronNodeGraph from "../neutron/core/node/NeutronGraphNode";
import { complexEdges, complexNodes } from "./__mixture__/nodes";

describe("Nodes", () => {
  it("build basic nodegraph", () => {
    const graph = new NeutronNodeGraph(complexNodes, complexEdges);

    expect(graph.inputNode.id).toBe("325bab26-7d75-442e-85f2-4dd328d4f146");
    expect(Object.entries(graph.inputNode.inputHandles).length).toBe(4);
  });

  it.todo("build complex nodegraph");

  it.todo("fails to build nodegraph because no input node");

  it.todo("fails to build nodegraph because it cycles");

  it.todo("fails to build nodegraph because it cycles");
});
