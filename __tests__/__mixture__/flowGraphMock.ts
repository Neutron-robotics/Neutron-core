export const flowGraphMock = {
  _id: '656b91fda97e7ff71eca041d',
  title: 'Flow graph example',
  type: 'Component',
  robot: '650eba9e784a5fd054fba1ef',
  imgUrl: 'http://localhost:3003/file/file-1701557768154-290723013.png',
  createdBy: '64baeae643aedb937d660a63',
  modifiedBy: '64baeae643aedb937d660a63',
  edges: [
    {
      source: '19c60b31-d102-4eb8-b0e8-81c155011f18',
      sourceHandle: 'output-1',
      target: 'f9998a91-ce0a-48e0-aa68-fdc028b46e3a',
      targetHandle: 'input-0',
      id: 'reactflow__edge-19c60b31-d102-4eb8-b0e8-81c155011f18output-0-f9998a91-ce0a-48e0-aa68-fdc028b46e3ainput-0'
    },
    {
      source: 'f9998a91-ce0a-48e0-aa68-fdc028b46e3a',
      sourceHandle: 'output-0',
      target: '2be1d640-6a57-4bde-96c1-42df250de733',
      targetHandle: 'input-0',
      id: 'reactflow__edge-f9998a91-ce0a-48e0-aa68-fdc028b46e3aoutput-0-2be1d640-6a57-4bde-96c1-42df250de733input-0'
    },
    {
      source: 'ad411990-cbf6-49cb-a8ca-acb57917dab6',
      sourceHandle: 'output-0',
      target: '2be1d640-6a57-4bde-96c1-42df250de733',
      targetHandle: 'input-0',
      id: 'reactflow__edge-ad411990-cbf6-49cb-a8ca-acb57917dab6output-0-2be1d640-6a57-4bde-96c1-42df250de733input-0'
    },
    {
      source: '2be1d640-6a57-4bde-96c1-42df250de733',
      sourceHandle: 'output-0',
      target: '19c60b31-d102-4eb8-b0e8-81c155011f18',
      targetHandle: 'input-0',
      id: 'reactflow__edge-2be1d640-6a57-4bde-96c1-42df250de733output-0-19c60b31-d102-4eb8-b0e8-81c155011f18input-0'
    },
    {
      source: '19c60b31-d102-4eb8-b0e8-81c155011f18',
      sourceHandle: 'output-0',
      target: 'e121382e-caed-4cec-b81c-24c3f3083cc9',
      targetHandle: 'input-0',
      id: 'reactflow__edge-19c60b31-d102-4eb8-b0e8-81c155011f18output-0-e121382e-caed-4cec-b81c-24c3f3083cc9input-0'
    }
  ],
  nodes: [
    {
      width: 150,
      height: 40,
      id: 'ad411990-cbf6-49cb-a8ca-acb57917dab6',
      type: 'flowNode',
      position: {
        x: 231.7013476699908,
        y: 61.98751075754615
      },
      data: {
        color: '#B2B2B2',
        name: 'inject',
        inputHandles: 0,
        outputHandles: 1,
        icon: 'inject.svg',
        specifics: {
          properties: [
            {
              type: 'string',
              name: 'Toto',
              value: 'Salut les gars',
              id: 'dc342fb1-ffdc-4b3a-a1b2-c296d16333fb'
            },
            {
              type: 'number',
              name: 'count',
              value: 0,
              id: '2cc1c495-0ce1-41b3-936a-4a337cea45b0'
            }
          ],
          inject: true,
          injectDelay: 0,
          repeat: 'interval'
        }
      },
      selected: false,
      positionAbsolute: {
        x: 231.7013476699908,
        y: 61.98751075754615
      },
      dragging: false
    },
    {
      width: 150,
      height: 40,
      id: '2be1d640-6a57-4bde-96c1-42df250de733',
      type: 'flowNode',
      position: {
        x: 479.03628195965825,
        y: 63.48651035930172
      },
      data: {
        color: '#FF7A00',
        name: 'function',
        inputHandles: 1,
        outputHandles: 1,
        icon: 'function.svg',
        specifics: {
          code: 'return({\n    ...msg, count: msg.count + 1\n})'
        }
      },
      selected: false,
      positionAbsolute: {
        x: 479.03628195965825,
        y: 63.48651035930172
      },
      dragging: false
    },
    {
      width: 150,
      height: 40,
      id: '19c60b31-d102-4eb8-b0e8-81c155011f18',
      type: 'flowNode',
      position: {
        x: 686.2594190773827,
        y: 41.84395268877981
      },
      data: {
        color: '#FFE500',
        name: 'switch',
        inputHandles: 1,
        outputHandles: 1,
        icon: 'switch.svg',
        specifics: {
          propertyName: 'count',
          switchFields: [
            {
              type: 'string',
              value: 10,
              operator: '==',
              id: '6161ee3c-c5fb-4356-8628-142f0894ccda'
            },
            {
              type: 'string',
              value: '10',
              operator: '<',
              id: 'd994d670-df5e-4a14-a7e4-d0c023b2b780'
            }
          ],
          switchMode: 'stop'
        }
      },
      selected: false,
      positionAbsolute: {
        x: 686.2594190773827,
        y: 41.84395268877981
      },
      dragging: false
    },
    {
      width: 150,
      height: 40,
      id: 'f9998a91-ce0a-48e0-aa68-fdc028b46e3a',
      type: 'flowNode',
      position: {
        x: 570.3045779929147,
        y: 193.44065134272796
      },
      data: {
        color: '#EE83FF',
        name: 'delay',
        inputHandles: 1,
        outputHandles: 1,
        icon: 'delay.svg',
        specifics: {
          mode: 'fixed',
          delay: 0.1,
          unit: 'second'
        }
      },
      selected: true,
      positionAbsolute: {
        x: 570.3045779929147,
        y: 193.44065134272796
      },
      dragging: false
    },
    {
      width: 150,
      height: 40,
      id: 'e121382e-caed-4cec-b81c-24c3f3083cc9',
      type: 'flowNode',
      position: {
        x: 938.7335749792888,
        y: 66.34535111795603
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
      selected: false,
      positionAbsolute: {
        x: 938.7335749792888,
        y: 66.34535111795603
      },
      dragging: false
    }
  ],
  createdAt: '2023-12-02T20:22:21.396Z',
  updatedAt: '2023-12-02T22:56:08.225Z',
  __v: 4,
  organization: {
    id: '64bbe0db32568d43042fbbc6',
    name: 'Hugosoft',
    imgUrl: 'http://localhost:3003/file/file-1691355901539-790914963.png'
  }
};
