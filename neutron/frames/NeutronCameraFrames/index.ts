import { IFramePackage } from "../../interfaces/frames";
import { cameraInfoFrame } from "./cameraInfo";
import { setFpsFrame } from "./setFps";
import { setResolutionFrame } from "./setResolution";
import { startCameraFrame } from "./startCamera";
import { stopCameraFrame } from "./stopCamera";

const NeutronCameraFrames: IFramePackage = {
  id: "neutron-camera",
  name: "Camera Frames",
  frames: [
    startCameraFrame,
    stopCameraFrame,
    cameraInfoFrame,
    setFpsFrame,
    setResolutionFrame,
  ],
};

export default NeutronCameraFrames;
