import axios from "axios";
import { sleep } from "./utils/time";
import { ConnectorGraph } from "./core/nodes/implementation/graphs";
import { DebugNode } from "./core/nodes/implementation/nodes";
import { IDebugEvent } from "./core/nodes/implementation/nodes/functions/DebugNode";
import RosContext from "./core/network/RosContext";
import * as fs from 'fs';

const nodes = [
  {
    width: 150,
    height: 40,
    id: "c4792d9d-f6c3-4e4c-a196-51dd7930f6dc",
    type: "flowNode",
    position: {
      x: 155,
      y: 368,
    },
    data: {
      color: "#FF0000",
      name: "subscriber",
      inputHandles: 0,
      outputHandles: 1,
      icon: "ros.svg",
      specifics: {
        topic: {
          _id: "659e77573b29779172958c94",
          name: "test_pub",
          messageType: {
            _id: "65a2fc499088196bb9f933cc",
            fields: [
              {
                fieldtype: "string",
                fieldname: "name",
                _id: "65a2fc499088196bb9f933cd",
              },
              {
                fieldtype: "int16",
                fieldname: "wheel_count",
                _id: "65a2fc499088196bb9f933ce",
              },
              {
                fieldtype: "bool",
                fieldname: "is_moving",
                _id: "65a2fc499088196bb9f933cf",
              },
              {
                fieldtype: "int16",
                fieldname: "speed",
                _id: "65a2fc499088196bb9f933d0",
              },
              {
                fieldtype: "int16",
                fieldname: "max_speed",
                _id: "65a2fc499088196bb9f933d1",
              },
            ],
            name: "myrobotics_protocol/msg/BaseInfos",
            __v: 0,
          },
          __v: 0,
        },
      },
    },
    selected: true,
    dragging: false,
    positionAbsolute: {
      x: 155,
      y: 368,
    },
  },
  {
    width: 150,
    height: 40,
    id: "ab3819bd-4692-4144-b211-5364901ad233",
    type: "flowNode",
    position: {
      x: 440,
      y: 386,
    },
    data: {
      color: "#018D20",
      name: "debug",
      inputHandles: 1,
      outputHandles: 0,
      icon: "info.svg",
      specifics: {
        output: "full",
      },
    },
    positionAbsolute: {
      x: 440,
      y: 386,
    },
  },
];

const edges = [
  {
    source: "c4792d9d-f6c3-4e4c-a196-51dd7930f6dc",
    sourceHandle: "output-0",
    target: "ab3819bd-4692-4144-b211-5364901ad233",
    targetHandle: "input-0",
    id: "reactflow__edge-c4792d9d-f6c3-4e4c-a196-51dd7930f6dcoutput-0-ab3819bd-4692-4144-b211-5364901ad233input-0",
  },
];

async function main() {
  const connectionHostname = "localhost";
  const connectionPort = 3030;
  const clientId = "tester";

  const neutronContextConfiguration = {
    hostname: connectionHostname,
    port: connectionPort,
    clientId: clientId,
  };

  const robotContextConfiguration = {
    hostname: '192.168.1.116',
    port: 9090,
    clientId: ''
  }

  const context = new RosContext(robotContextConfiguration);

  const connected = await context.connect()

  console.log("Connected! ", connected)

  context.subscribe(
    '/video_frames',
    'sensor_msgs/msg/CompressedImage',
    (data: any) => {
      console.log("Received data!", data)
      fs.writeFileSync('./test.jpg',  Buffer.from(data.data, 'base64'))
      const jpg = Buffer.from(data.data, 'base64')

      
    }
  )

  // await axios.post(
  //   `http://${connectionHostname}:${connectionPort}/register/${clientId}`
  // );
  // await context.connect();

  // const infos = await context.getInfo();


  // const graph = new ConnectorGraph(nodes, edges);

  // graph.useContext(context)

  // const debugNode = graph.getNodeById<DebugNode>('ab3819bd-4692-4144-b211-5364901ad233')

  // const handleDebugEvent = (data: IDebugEvent): void | Promise<void> => {
  //   console.log("debug event: ", data);
  // }

  // debugNode?.DebugEvent.on(handleDebugEvent)

  // const trigger = (data: any) => {
  //   console.log("Triggered data", data);
  // };

  // context.on(
  //   {
  //     methodType: "test_pub",
  //     format: "myrobotics_protocol/msg/BaseInfos",
  //     payload: null,
  //   },
  //   trigger
  // );

  while (true) {
    await sleep(100);
  }
}

main()
  .then(() => {
    console.log("Main function and async operations completed");
  })
  .catch((error) => {
    console.error("Error:", error);
  });
