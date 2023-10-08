import NeutronNodeGraph from "./core/node/NeutronGraphNode";
import BaseControllerNode from "./core/node/implementation/BaseControllerNode";

const osoyooNodes = [
  {
    id: "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583",
    type: "publisherNode",
    position: {
      x: 841.0663726915275,
      y: 253.49199335652185,
    },
    title: "test pub",
    isInput: false,
  },
  {
    id: "325bab26-7d75-442e-85f2-4dd328d4f146",
    type: "baseControllerNode",
    position: {
      x: -308.57738856404933,
      y: 218.35701429784808,
    },
    title: "Base Controller",
    isInput: true,
  },
  {
    id: "3059327c-ca55-4c21-9486-ed2e3e46cd85",
    type: "ifNode",
    position: {
      x: 313.7443764666964,
      y: 252.72837138728983,
    },
    preview: false,
    title: "If",
    isInput: false,
  },
  {
    id: "d2b4e180-479e-4e54-a80a-8d1fa8111142",
    type: "purcentageNode",
    position: {
      x: 430.87742397209365,
      y: 247.9409093503994,
    },
    preview: false,
    title: "Purcentage",
    isInput: false,
  },
  {
    id: "35978d35-82bd-450c-8629-0b5874067305",
    type: "ifNode",
    position: {
      x: 312.9547820332576,
      y: 352.2438847244388,
    },
    title: "If",
    isInput: false,
  },
  {
    id: "26476e1f-3a8d-4ed7-b990-dbb2ed2bf106",
    type: "purcentageNode",
    position: {
      x: 436.4808466407629,
      y: 348.29975186136716,
    },
    title: "Purcentage",
    isInput: false,
  },
  {
    id: "38e4b8d4-6e1a-4e4c-ada9-702518eefef2",
    type: "ifNode",
    position: {
      x: 356.5658631000264,
      y: 560.195541552714,
    },
    title: "If",
    dragging: false,
    isInput: false,
  },
  {
    id: "0335493c-576c-4451-b0a2-579750784c1b",
    type: "ifNode",
    position: {
      x: 356.5658631000263,
      y: 458.4855625008674,
    },
    title: "If",
    isInput: false,
  },
  {
    id: "8eeba159-8a27-46f7-9a69-c5590e19ec1b",
    type: "purcentageNode",
    position: {
      x: 485.2821895336124,
      y: 556.829675744855,
    },
    title: "Purcentage",
    isInput: false,
  },
  {
    id: "9da160ba-b461-4a92-859f-78ed78f28abd",
    type: "purcentageNode",
    position: {
      x: 486.5374615248951,
      y: 455.1526444509609,
    },
    title: "Purcentage",
    isInput: false,
  },
];

const osoyooEdges = [
  {
    source: "325bab26-7d75-442e-85f2-4dd328d4f146",
    sourceHandle: "top",
    target: "3059327c-ca55-4c21-9486-ed2e3e46cd85",
    targetHandle: "nodeInput",
    id: "reactflow__edge-325bab26-7d75-442e-85f2-4dd328d4f146top-3059327c-ca55-4c21-9486-ed2e3e46cd85input-7d1502ee-a7af-4504-998d-997fcef0ced0",
  },
  {
    source: "3059327c-ca55-4c21-9486-ed2e3e46cd85",
    sourceHandle: "nodeOutput",
    target: "d2b4e180-479e-4e54-a80a-8d1fa8111142",
    targetHandle: "nodeInput",
    id: "reactflow__edge-3059327c-ca55-4c21-9486-ed2e3e46cd85output-true-7d1502ee-a7af-4504-998d-997fcef0ced0-d2b4e180-479e-4e54-a80a-8d1fa8111142source",
  },
  {
    source: "d2b4e180-479e-4e54-a80a-8d1fa8111142",
    sourceHandle: "nodeOutput",
    target: "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583",
    targetHandle: "x",
    id: "reactflow__edge-d2b4e180-479e-4e54-a80a-8d1fa8111142result-aaf1b1c6-bf43-4bcf-bf4b-e354e9316583x",
  },
  {
    source: "325bab26-7d75-442e-85f2-4dd328d4f146",
    sourceHandle: "bottom",
    target: "35978d35-82bd-450c-8629-0b5874067305",
    targetHandle: "nodeInput",
    id: "reactflow__edge-325bab26-7d75-442e-85f2-4dd328d4f146bottom-35978d35-82bd-450c-8629-0b5874067305input-03f07255-fa22-465c-9ffa-58518e66042b",
  },
  {
    source: "35978d35-82bd-450c-8629-0b5874067305",
    sourceHandle: "nodeOutput",
    target: "26476e1f-3a8d-4ed7-b990-dbb2ed2bf106",
    targetHandle: "nodeInput",
    id: "reactflow__edge-35978d35-82bd-450c-8629-0b5874067305output-true-03f07255-fa22-465c-9ffa-58518e66042b-26476e1f-3a8d-4ed7-b990-dbb2ed2bf106source",
  },
  {
    source: "26476e1f-3a8d-4ed7-b990-dbb2ed2bf106",
    sourceHandle: "nodeOutput",
    target: "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583",
    targetHandle: "x",
    id: "reactflow__edge-26476e1f-3a8d-4ed7-b990-dbb2ed2bf106result-aaf1b1c6-bf43-4bcf-bf4b-e354e9316583x",
  },
  {
    source: "325bab26-7d75-442e-85f2-4dd328d4f146",
    sourceHandle: "left",
    target: "0335493c-576c-4451-b0a2-579750784c1b",
    targetHandle: "nodeInput",
    id: "reactflow__edge-325bab26-7d75-442e-85f2-4dd328d4f146left-0335493c-576c-4451-b0a2-579750784c1binput-246cd8a9-a495-4121-bb00-9cd04dd44708",
  },
  {
    source: "325bab26-7d75-442e-85f2-4dd328d4f146",
    sourceHandle: "right",
    target: "38e4b8d4-6e1a-4e4c-ada9-702518eefef2",
    targetHandle: "nodeInput",
    id: "reactflow__edge-325bab26-7d75-442e-85f2-4dd328d4f146right-38e4b8d4-6e1a-4e4c-ada9-702518eefef2input-ff9835a2-2bad-46f6-894a-fd318efb792f",
  },
  {
    source: "0335493c-576c-4451-b0a2-579750784c1b",
    sourceHandle: "nodeOutput",
    target: "9da160ba-b461-4a92-859f-78ed78f28abd",
    targetHandle: "nodeInput",
    id: "reactflow__edge-0335493c-576c-4451-b0a2-579750784c1boutput-true-246cd8a9-a495-4121-bb00-9cd04dd44708-9da160ba-b461-4a92-859f-78ed78f28abdsource",
  },
  {
    source: "38e4b8d4-6e1a-4e4c-ada9-702518eefef2",
    sourceHandle: "nodeOutput",
    target: "8eeba159-8a27-46f7-9a69-c5590e19ec1b",
    targetHandle: "nodeInput",
    id: "reactflow__edge-38e4b8d4-6e1a-4e4c-ada9-702518eefef2output-true-ff9835a2-2bad-46f6-894a-fd318efb792f-8eeba159-8a27-46f7-9a69-c5590e19ec1bsource",
  },
  {
    source: "9da160ba-b461-4a92-859f-78ed78f28abd",
    sourceHandle: "nodeOutput",
    target: "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583",
    targetHandle: "yaw",
    id: "reactflow__edge-9da160ba-b461-4a92-859f-78ed78f28abdresult-aaf1b1c6-bf43-4bcf-bf4b-e354e9316583yaw",
  },
  {
    source: "8eeba159-8a27-46f7-9a69-c5590e19ec1b",
    sourceHandle: "nodeOutput",
    target: "aaf1b1c6-bf43-4bcf-bf4b-e354e9316583",
    targetHandle: "yaw",
    id: "reactflow__edge-8eeba159-8a27-46f7-9a69-c5590e19ec1bresult-aaf1b1c6-bf43-4bcf-bf4b-e354e9316583yaw",
  },
];

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
    isInput: true,
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

// const nodegraph = makeNodeGraph(osoyooNodes, osoyooEdges);

const graph = new NeutronNodeGraph(osoyooNodes, osoyooEdges);

const controlNode = graph.getNode<BaseControllerNode>(
  "325bab26-7d75-442e-85f2-4dd328d4f146"
);

if (!controlNode) throw Error("");

controlNode.sendInput({
  top: 10,
  speed: 20,
});

console.log("finished");
