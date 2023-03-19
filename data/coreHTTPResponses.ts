export const connectionInfosMock = {
  robot: {
    battery: -1,
    name: "Development",
    type: "OsoyooRobot",
    status: "Available",
    connection: {
      type: "Rosbridge",
      port: 9090,
    },
    modules: [
      {
        id: "8d09f4df-9951-4dca-99da-e881b13ff23b",
        name: "Osoyoo base",
        type: "base",
      },
      {
        id: "98932797-ea76-4ce1-b699-842ce54cedc6",
        name: "Camera",
        type: "camera",
      },
      {
        id: "c0b1b0a1-1b1a-4b1a-9b1a-1b1a0b1a1b1a",
        name: "Rosbridge",
        type: "Rosbridge",
      },
      {
        id: "c0b1b0a1-1b1a-4b1a-9b1a-1b1a0b1a1b1b",
        name: "test",
        type: "test",
      },
    ],
  },
};

export const robotStatusMock = {
  battery: -1,
  cpu: 37.1,
  memory: 75.7,
  operationTime: 1678568717863,
  modules: [
    {
      cpu: 0.0,
      mem: 1.759722351829313,
      mem_usage: 35452.0,
      active: true,
      pid: 469122,
      name: "Camera",
      id: "98932797-ea76-4ce1-b699-842ce54cedc6",
    },
  ],
};

export const robotStatusesForStopMock = {
  battery: -1,
  cpu: 37.1,
  memory: 75.7,
  operationTime: 1678568717863,
  modules: [
    {
      cpu: 0.0,
      mem: 1.759722351829313,
      mem_usage: 35452.0,
      active: true,
      pid: 469122,
      name: "Osoyoo base",
      id: "8d09f4df-9951-4dca-99da-e881b13ff23b",
    },
    {
      cpu: 0.0,
      mem: 1.759722351829313,
      mem_usage: 35452.0,
      active: true,
      pid: 469122,
      name: "Camera",
      id: "98932797-ea76-4ce1-b699-842ce54cedc6",
    },
    {
      cpu: 0.0,
      mem: 1.759722351829313,
      mem_usage: 35452.0,
      active: true,
      pid: 469122,
      id: "c0b1b0a1-1b1a-4b1a-9b1a-1b1a0b1a1b1a",
      name: "Rosbridge",
    },
    {
      cpu: 0.0,
      mem: 1.759722351829313,
      mem_usage: 35452.0,
      active: true,
      pid: 469122,
      id: "c0b1b0a1-1b1a-4b1a-9b1a-1b1a0b1a1b1b",
      name: "test",
    },
  ],
};