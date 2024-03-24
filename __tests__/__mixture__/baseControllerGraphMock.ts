const graphMock = {
  _id: '65e0e6add7d3a28f2dacf850',
  title: 'Wheeler Base',
  type: 'Connector',
  robot: '65de280d524b37c91a186cbc',
  part: '65de61f0c8e6d70dcf07acb2',
  imgUrl: 'http://localhost:3003/file/file-1709484686113-349370106.png',
  createdBy: '64baeae643aedb937d660a63',
  modifiedBy: '64baeae643aedb937d660a63',
  edges: [
    {
      source: 'a1c45a3c-534d-4973-84e2-898197c03935',
      sourceHandle: 'output-0',
      target: 'd2145bae-d75e-4c54-9bdb-6fb584cfbd79',
      targetHandle: 'input-0',
      id: 'reactflow__edge-a1c45a3c-534d-4973-84e2-898197c03935output-0-d2145bae-d75e-4c54-9bdb-6fb584cfbd79input-0'
    },
    {
      source: 'd2145bae-d75e-4c54-9bdb-6fb584cfbd79',
      sourceHandle: 'output-0',
      target: 'c8dc24f5-46d7-452a-a28e-abacbdd524aa',
      targetHandle: 'input-0',
      id: 'reactflow__edge-d2145bae-d75e-4c54-9bdb-6fb584cfbd79output-0-c8dc24f5-46d7-452a-a28e-abacbdd524aainput-0'
    },
    {
      source: 'd2145bae-d75e-4c54-9bdb-6fb584cfbd79',
      sourceHandle: 'output-1',
      target: '3f897ba3-5098-41b9-ac4d-c58a7e40393c',
      targetHandle: 'input-0',
      id: 'reactflow__edge-d2145bae-d75e-4c54-9bdb-6fb584cfbd79output-1-3f897ba3-5098-41b9-ac4d-c58a7e40393cinput-0'
    },
    {
      source: '3f897ba3-5098-41b9-ac4d-c58a7e40393c',
      sourceHandle: 'output-0',
      target: '38ebb899-bccd-40a5-a401-daae0ff8f210',
      targetHandle: 'input-0',
      id: 'reactflow__edge-3f897ba3-5098-41b9-ac4d-c58a7e40393coutput-0-38ebb899-bccd-40a5-a401-daae0ff8f210input-0'
    },
    {
      source: 'c8dc24f5-46d7-452a-a28e-abacbdd524aa',
      sourceHandle: 'output-0',
      target: '4ce6e20b-fbfd-49b0-a4c8-876b8d4fa775',
      targetHandle: 'input-0',
      id: 'reactflow__edge-c8dc24f5-46d7-452a-a28e-abacbdd524aaoutput-0-4ce6e20b-fbfd-49b0-a4c8-876b8d4fa775input-0'
    }
  ],
  nodes: [
    {
      id: 'a1c45a3c-534d-4973-84e2-898197c03935',
      type: 'flowNode',
      position: {
        x: 145.03670110101967,
        y: 311
      },
      data: {
        color: '#BD00FF',
        name: 'base controller',
        inputHandles: 0,
        outputHandles: 1,
        icon: 'component.svg',
        specifics: {
          debugData: {
            speed: 30,
            x: 0,
            y: 0
          }
        }
      },
      width: 150,
      height: 40,
      selected: false,
      positionAbsolute: {
        x: 145.03670110101967,
        y: 311
      },
      dragging: false
    },
    {
      id: 'd2145bae-d75e-4c54-9bdb-6fb584cfbd79',
      type: 'flowNode',
      position: {
        x: 355,
        y: 184
      },
      data: {
        color: '#FFE500',
        name: 'switch',
        inputHandles: 1,
        outputHandles: 2,
        icon: 'switch.svg',
        specifics: {
          propertyName: 'x',
          switchFields: [
            {
              type: 'number',
              value: 0,
              operator: '==',
              id: 'a8c8a248-d0eb-442a-aaba-00129eba2b15'
            },
            {
              type: 'number',
              value: 0,
              operator: '!=',
              id: '4f2578e9-d002-4466-a726-f9ec1236803c'
            }
          ],
          switchMode: 'stop'
        }
      },
      width: 150,
      height: 50,
      selected: false,
      positionAbsolute: {
        x: 355,
        y: 184
      },
      dragging: false
    },
    {
      id: 'c8dc24f5-46d7-452a-a28e-abacbdd524aa',
      type: 'flowNode',
      position: {
        x: 592.3946418387494,
        y: 175.66969009082248
      },
      data: {
        color: '#FFE500',
        name: 'switch',
        inputHandles: 1,
        outputHandles: 1,
        icon: 'switch.svg',
        specifics: {
          propertyName: 'y',
          switchFields: [
            {
              type: 'number',
              value: '0',
              operator: '==',
              id: 'a8c8a248-d0eb-442a-aaba-00129eba2b15'
            }
          ],
          switchMode: 'continue'
        }
      },
      width: 150,
      height: 40,
      selected: true,
      positionAbsolute: {
        x: 592.3946418387494,
        y: 175.66969009082248
      },
      dragging: false
    },
    {
      id: '4ce6e20b-fbfd-49b0-a4c8-876b8d4fa775',
      type: 'flowNode',
      position: {
        x: 796.0556816682539,
        y: 87.55874676546426
      },
      data: {
        color: '#018D20',
        name: 'debug',
        inputHandles: 1,
        outputHandles: 0,
        icon: 'info.svg',
        specifics: {
          output: 'full'
        }
      },
      width: 150,
      height: 40,
      selected: false,
      positionAbsolute: {
        x: 796.0556816682539,
        y: 87.55874676546426
      },
      dragging: false
    },
    {
      id: '3f897ba3-5098-41b9-ac4d-c58a7e40393c',
      type: 'flowNode',
      position: {
        x: 565.908037241876,
        y: 343.6239187173353
      },
      data: {
        color: '#FF7A00',
        name: 'function',
        inputHandles: 1,
        outputHandles: 1,
        icon: 'function.svg',
        specifics: {
          code: '// Write there your own Typescript function to execute custom code.\n// You can access the `req` object that contains this node input.\n// The output of this node will be empty by default, but it is possible\n// to define a customized output by returning an object\n\nreturn {\n    x: msg.x * msg.speed,\n    y: 0,\n    z: 0,\n    pitch: 0,\n    roll: 0,\n    yaw: msg.y\n}'
        }
      },
      width: 150,
      height: 40,
      selected: false,
      positionAbsolute: {
        x: 565.908037241876,
        y: 343.6239187173353
      },
      dragging: false
    },
    {
      id: '38ebb899-bccd-40a5-a401-daae0ff8f210',
      type: 'flowNode',
      position: {
        x: 802.611057811501,
        y: 342.38914068359855
      },
      data: {
        color: '#018D20',
        name: 'debug',
        inputHandles: 1,
        outputHandles: 0,
        icon: 'info.svg',
        specifics: {
          output: 'full'
        }
      },
      width: 150,
      height: 40,
      selected: false,
      dragging: false,
      positionAbsolute: {
        x: 802.611057811501,
        y: 342.38914068359855
      }
    }
  ],
  createdAt: '2024-02-29T20:18:53.426Z',
  updatedAt: '2024-03-03T16:51:26.135Z',
  __v: 2,
  organization: {
    id: '64bbe0db32568d43042fbbc6',
    name: 'Hugosoft',
    imgUrl: 'http://localhost:3003/file/file-1691355901539-790914963.png'
  }
};

export default graphMock;
