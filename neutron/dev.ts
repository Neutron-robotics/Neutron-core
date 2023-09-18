import makeNodeGraph from "./core/node/NeutronGraphNode";

const nodes = [
  {
    id: "69a5f4a5-6e08-4d00-88c0-77aa4929de4f",
    type: "subscriberNode",
    position: {
      x: -80.60000000000002,
      y: 318,
    },
    width: 81,
    height: 116,
    input: true,
  },
  {
    id: "288a3812-e455-4a34-9f8d-a54aa7f83bd5",
    type: "andNode",
    position: {
      x: 113.39999999999998,
      y: 376,
    },
    width: 80,
    height: 60,
  },
  {
    id: "1c720c53-429f-4323-8088-2bc1fa9cf35a",
    type: "purcentageNode",
    position: {
      x: 268.4,
      y: 370,
    },
    width: 160,
    height: 70,
  },
  {
    id: "ce3ca636-01a5-4c53-8236-66e86bca141d",
    type: "pickNode",
    position: {
      x: 499.4,
      y: 372,
    },
    width: 120,
    height: 70,
  },
];

const edges = [
  {
    source: "69a5f4a5-6e08-4d00-88c0-77aa4929de4f",
    sourceHandle: "image",
    target: "288a3812-e455-4a34-9f8d-a54aa7f83bd5",
    targetHandle: "input-1-d5c8948e-b770-4fad-a4a6-ea0345f485ff",
    id: "reactflow__edge-69a5f4a5-6e08-4d00-88c0-77aa4929de4fimage-288a3812-e455-4a34-9f8d-a54aa7f83bd5input-1-d5c8948e-b770-4fad-a4a6-ea0345f485ff",
  },
  {
    source: "69a5f4a5-6e08-4d00-88c0-77aa4929de4f",
    sourceHandle: "resolution",
    target: "288a3812-e455-4a34-9f8d-a54aa7f83bd5",
    targetHandle: "input-2-d5c8948e-b770-4fad-a4a6-ea0345f485ff",
    id: "reactflow__edge-69a5f4a5-6e08-4d00-88c0-77aa4929de4fresolution-288a3812-e455-4a34-9f8d-a54aa7f83bd5input-2-d5c8948e-b770-4fad-a4a6-ea0345f485ff",
  },
  {
    source: "288a3812-e455-4a34-9f8d-a54aa7f83bd5",
    sourceHandle: "output-d5c8948e-b770-4fad-a4a6-ea0345f485ff",
    target: "1c720c53-429f-4323-8088-2bc1fa9cf35a",
    targetHandle: "input-8dc2f078-3c9f-4418-81cd-33362421894c",
    id: "reactflow__edge-288a3812-e455-4a34-9f8d-a54aa7f83bd5output-d5c8948e-b770-4fad-a4a6-ea0345f485ff-1c720c53-429f-4323-8088-2bc1fa9cf35ainput-8dc2f078-3c9f-4418-81cd-33362421894c",
  },
  {
    source: "1c720c53-429f-4323-8088-2bc1fa9cf35a",
    sourceHandle: "output-8dc2f078-3c9f-4418-81cd-33362421894c",
    target: "ce3ca636-01a5-4c53-8236-66e86bca141d",
    targetHandle: "input-4e1a839a-7a13-44d3-baf2-ea258f77bdda",
    id: "reactflow__edge-1c720c53-429f-4323-8088-2bc1fa9cf35aoutput-8dc2f078-3c9f-4418-81cd-33362421894c-ce3ca636-01a5-4c53-8236-66e86bca141dinput-4e1a839a-7a13-44d3-baf2-ea258f77bdda",
  },
];

const nodegraph = makeNodeGraph(nodes, edges);

console.log("finished");
