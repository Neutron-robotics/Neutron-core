import { IFramePackage } from "../../interfaces/frames";
import { startCameraFrame } from "./startCamera";
import { stopCameraFrame } from "./stopCamera";

const NeutronCameraFrames: IFramePackage = {
  id: "neutron-camera",
  name: "Camera Frames",
  frames: [startCameraFrame, stopCameraFrame],
};

export default NeutronCameraFrames;
