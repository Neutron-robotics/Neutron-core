export type RosMsgFieldInfo = {
    name: string;
    type: 'string' | 'number' | 'boolean';
    isArray?: boolean;
    description?: string;
  };

export type RosMsgTypeInfo = {
    label: string;
    path: string;
    description?: string;
    fields?: RosMsgFieldInfo[];
  };

export const stdMsgTypes: RosMsgTypeInfo[] = [
  {
    label: 'String',
    path: 'std_msgs/msg/String',
    description: 'String message',
    fields: [
      { name: 'data', type: 'string', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'Byte',
    path: 'std_msgs/msg/Byte',
    description: 'Single byte message',
    fields: [
      { name: 'data', type: 'string', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'Char',
    path: 'std_msgs/msg/Char',
    description: 'Single character message',
    fields: [
      { name: 'data', type: 'string', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'Bool',
    path: 'std_msgs/msg/Bool',
    description: 'Boolean message',
    fields: [
      { name: 'data', type: 'boolean', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'Int8',
    path: 'std_msgs/msg/Int8',
    description: '8-bit signed integer',
    fields: [
      { name: 'data', type: 'number', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'UInt8',
    path: 'std_msgs/msg/UInt8',
    description: '8-bit unsigned integer',
    fields: [
      { name: 'data', type: 'number', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'Int16',
    path: 'std_msgs/msg/Int16',
    description: '16-bit signed integer',
    fields: [
      { name: 'data', type: 'number', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'UInt16',
    path: 'std_msgs/msg/UInt16',
    description: '16-bit unsigned integer',
    fields: [
      { name: 'data', type: 'number', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'Int32',
    path: 'std_msgs/msg/Int32',
    description: '32-bit signed integer',
    fields: [
      { name: 'data', type: 'number', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'UInt32',
    path: 'std_msgs/msg/UInt32',
    description: '32-bit unsigned integer',
    fields: [
      { name: 'data', type: 'number', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'Int64',
    path: 'std_msgs/msg/Int64',
    description: '64-bit signed integer',
    fields: [
      { name: 'data', type: 'number', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'UInt64',
    path: 'std_msgs/msg/UInt64',
    description: '64-bit unsigned integer',
    fields: [
      { name: 'data', type: 'number', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'Float32',
    path: 'std_msgs/msg/Float32',
    description: '32-bit floating-point number',
    fields: [
      { name: 'data', type: 'number', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'Float64',
    path: 'std_msgs/msg/Float64',
    description: '64-bit floating-point number',
    fields: [
      { name: 'data', type: 'number', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'Time',
    path: 'std_msgs/msg/Time',
    description: 'ROS time representation',
    fields: [
      { name: 'data', type: 'number', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'Duration',
    path: 'std_msgs/msg/Duration',
    description: 'ROS duration representation',
    fields: [
      { name: 'data', type: 'number', description: 'The primitive value of the message object' }
    ]
  },
  {
    label: 'Empty',
    path: 'std_msgs/msg/Empty',
    description: 'Empty message'
  }
];
