import { IFramePackage } from "../../interfaces/frames";
import { negociate } from "./negociate";


const WebRTCFrames: IFramePackage = {
  id: "webrtc",
  name: "WebRTC",
  frames: [negociate],
};

export default WebRTCFrames;
