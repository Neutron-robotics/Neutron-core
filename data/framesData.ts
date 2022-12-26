const framePackage = {
  id: "rgfwvdwfdf",
  name: "robotBaseFrame",
  frames: [
    {
      id: "trhtnh5nryt9n4yn4rn5rny",
      name: "Move",
      build: (body: any) => {
        return {
          id: "move",
          methodType: "publishLoop",
          method: "set_velocity",
          payload: body,
        };
      },
    },
  ],
};

const framePackageUndefinedCallback = {
  id: "rgfwvdwfdf",
  name: "robotBaseFrame",
  frames: [
    {
      id: "trhtnh5nryt9n4yn4rn5rny",
      callBackFrames: ["setKeepAlive"],
      name: "Move",
      build: (body: any) => {
        return {
          id: "move",
          methodType: "publishLoop",
          method: "set_velocity",
          payload: body,
          callBackFrame: "setKeepAlive",
        };
      },
    },
  ],
};

const framePackageWrongMethodType = {
  id: "rgfwvdwfdf",
  name: "robotBaseFrame",
  frames: [
    {
      id: "trhtnh5nryt9n4yn4rn5rny",
      name: "Move",
      build: (body: any) => {
        return {
          id: "move",
          methodType: "pubop",
          method: "set_velocity",
          payload: body,
          callBackFrame: "setKeepAlive",
        };
      },
    },
  ],
};

export {
  framePackage,
  framePackageUndefinedCallback,
  framePackageWrongMethodType,
};
