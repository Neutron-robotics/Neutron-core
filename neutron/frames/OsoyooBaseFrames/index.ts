import { IFramePackage } from "../../interfaces/frames";
import { keepAliveFrame } from "./keepAliveFrame";
import { moveFrame } from "./moveFrame";
import { stopFrame } from "./stopFrame";

const OsoyooBaseFrames: IFramePackage = {
  id: "osoyooBase",
  name: "Osoyoo Base",
  frames: [keepAliveFrame, moveFrame, stopFrame],
};

export default OsoyooBaseFrames;
