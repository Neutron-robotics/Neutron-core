const graphTemplate = {
  _id: '656a666b128f6b08727aaee0',
  title: 'Test graph ultime',
  type: 'Component',
  robot: '650eba9e784a5fd054fba1ef',
  imgUrl: 'http://localhost:3003/file/file-1701471850999-541419044.png',
  createdBy: '64baeae643aedb937d660a63',
  modifiedBy: '64baeae643aedb937d660a63',
  edges: [
    {
      source: 'bb6e7ae5-69d6-4822-8803-d66e18255f73',
      sourceHandle: 'output-0',
      target: 'a560d355-ba9b-43d1-bdd2-8235a45dfb52',
      targetHandle: 'input-0',
      id: 'reactflow__edge-bb6e7ae5-69d6-4822-8803-d66e18255f73output-0-a560d355-ba9b-43d1-bdd2-8235a45dfb52input-0'
    },
    {
      source: 'bb6e7ae5-69d6-4822-8803-d66e18255f73',
      sourceHandle: 'output-0',
      target: '396748fb-c7f3-4d07-a649-49cce5fc03bd',
      targetHandle: 'input-0',
      id: 'reactflow__edge-bb6e7ae5-69d6-4822-8803-d66e18255f73output-0-396748fb-c7f3-4d07-a649-49cce5fc03bdinput-0'
    },
    {
      source: '396748fb-c7f3-4d07-a649-49cce5fc03bd',
      sourceHandle: 'output-0',
      target: '34095948-8fc8-4286-b4ad-886a0e58277b',
      targetHandle: 'input-0',
      id: 'reactflow__edge-396748fb-c7f3-4d07-a649-49cce5fc03bdoutput-0-34095948-8fc8-4286-b4ad-886a0e58277binput-0'
    },
    {
      source: '34095948-8fc8-4286-b4ad-886a0e58277b',
      sourceHandle: 'output-0',
      target: '2e8704ee-7e4c-4a4d-85f5-aed87b27ef40',
      targetHandle: 'input-0',
      id: 'reactflow__edge-34095948-8fc8-4286-b4ad-886a0e58277boutput-0-2e8704ee-7e4c-4a4d-85f5-aed87b27ef40input-0'
    },
    {
      source: '2e8704ee-7e4c-4a4d-85f5-aed87b27ef40',
      sourceHandle: 'output-1',
      target: 'f63a4e90-ecb2-44c9-ac39-d9c8d2bca971',
      targetHandle: 'input-0',
      id: 'reactflow__edge-2e8704ee-7e4c-4a4d-85f5-aed87b27ef40output-0-f63a4e90-ecb2-44c9-ac39-d9c8d2bca971input-0'
    },
    {
      source: '2e8704ee-7e4c-4a4d-85f5-aed87b27ef40',
      sourceHandle: 'output-0',
      target: '663463fb-5dab-4a37-8521-c24dc73db9cc',
      targetHandle: 'input-0',
      id: 'reactflow__edge-2e8704ee-7e4c-4a4d-85f5-aed87b27ef40output-0-663463fb-5dab-4a37-8521-c24dc73db9ccinput-0'
    }
  ],
  nodes: [
    {
      width: 150,
      height: 40,
      id: 'a560d355-ba9b-43d1-bdd2-8235a45dfb52',
      type: 'flowNode',
      position: {
        x: 428,
        y: 303
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
      dragging: false,
      positionAbsolute: {
        x: 428,
        y: 303
      }
    },
    {
      width: 150,
      height: 40,
      id: 'bb6e7ae5-69d6-4822-8803-d66e18255f73',
      type: 'flowNode',
      position: {
        x: 123,
        y: 186
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
              name: 'title',
              value: 'Yoleboss',
              id: 'a6b9dd69-98c5-4658-99e5-f2a912231c1a'
            },
            {
              type: 'string',
              name: 'content',
              value:
                'Salut mon frere, comment tu vas ? J\'espere que tu verras ce long message qui est fond reste assez court. Amine',
              id: '0d0b5ffb-7fd5-4d80-a25f-8b2e93c6aba9'
            }
          ],
          inject: true,
          injectDelay: 0,
          repeat: 'interval'
        }
      },
      selected: false,
      positionAbsolute: {
        x: 123,
        y: 186
      },
      dragging: false
    },
    {
      width: 150,
      height: 40,
      id: '396748fb-c7f3-4d07-a649-49cce5fc03bd',
      type: 'flowNode',
      position: {
        x: 424,
        y: 170
      },
      data: {
        color: '#FFE500',
        name: 'change',
        inputHandles: 1,
        outputHandles: 1,
        icon: 'change.svg',
        specifics: {
          fields: [
            {
              id: 'eb7d4610-de11-493f-b180-e3f0eb3cfee2',
              mode: 'move',
              inputField: 'title',
              targetField: 'from'
            },
            {
              id: '8f3e5f8b-1846-490d-a482-8d44136b6a48',
              mode: 'move',
              inputField: 'content',
              targetField: 'message'
            }
          ]
        }
      },
      selected: false,
      dragging: false,
      positionAbsolute: {
        x: 424,
        y: 170
      }
    },
    {
      id: '34095948-8fc8-4286-b4ad-886a0e58277b',
      type: 'flowNode',
      position: {
        x: 631,
        y: 191
      },
      data: {
        color: '#FF7A00',
        name: 'function',
        inputHandles: 1,
        outputHandles: 1,
        icon: 'function.svg',
        specifics: {
          code: 'return {...msg}'
        }
      },
      width: 150,
      height: 40,
      selected: false,
      positionAbsolute: {
        x: 631,
        y: 191
      },
      dragging: false
    },
    {
      id: '2e8704ee-7e4c-4a4d-85f5-aed87b27ef40',
      type: 'flowNode',
      position: {
        x: 834,
        y: 282
      },
      data: {
        color: '#FFE500',
        name: 'switch',
        inputHandles: 1,
        outputHandles: 1,
        icon: 'switch.svg',
        specifics: {
          propertyName: 'from',
          switchFields: [
            {
              type: 'string',
              value: 'Yoleboss',
              operator: '==',
              id: '6161ee3c-c5fb-4356-8628-142f0894ccda'
            },
            {
              type: 'string',
              value: 'lemondade',
              operator: '==',
              id: 'd994d670-df5e-4a14-a7e4-d0c023b2b780'
            }
          ],
          switchMode: 'continue'
        }
      },
      width: 150,
      height: 40,
      selected: false,
      positionAbsolute: {
        x: 834,
        y: 282
      },
      dragging: false
    },
    {
      id: 'f63a4e90-ecb2-44c9-ac39-d9c8d2bca971',
      type: 'flowNode',
      position: {
        x: 1055.784920569285,
        y: 209.14795835372325
      },
      data: {
        color: '#018D20',
        name: 'debug',
        inputHandles: 1,
        outputHandles: 0,
        icon: 'info.svg',
        specifics: {}
      },
      width: 150,
      height: 40,
      selected: false,
      positionAbsolute: {
        x: 1055.784920569285,
        y: 209.14795835372325
      },
      dragging: false
    },
    {
      id: '663463fb-5dab-4a37-8521-c24dc73db9cc',
      type: 'flowNode',
      position: {
        x: 1059.6192186588944,
        y: 313.95210613637346
      },
      data: {
        color: '#018D20',
        name: 'debug',
        inputHandles: 1,
        outputHandles: 0,
        icon: 'info.svg',
        specifics: {}
      },
      width: 150,
      height: 40,
      selected: false,
      positionAbsolute: {
        x: 1059.6192186588944,
        y: 313.95210613637346
      },
      dragging: false
    }
  ],
  createdAt: '2023-12-01T23:04:11.027Z',
  updatedAt: '2023-12-01T23:04:11.029Z',
  __v: 0,
  organization: {
    id: '64bbe0db32568d43042fbbc6',
    name: 'Hugosoft',
    imgUrl: 'http://localhost:3003/file/file-1691355901539-790914963.png'
  }
};

export { graphTemplate };
