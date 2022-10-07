import { IFrame } from "../../interfaces/frames";

const keepAliveFrame: IFrame = {
  id: "keepAlive",
  name: "Keep Alive",
  build: (body: any) => {
    return {
      id: "keepAlive",
      methodType: "publish",
      method: "set_keep_alive",
      payload: body,
    };
  },
};

export {
    keepAliveFrame,
}