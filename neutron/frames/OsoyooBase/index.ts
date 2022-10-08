import { keepAliveFrame } from "./keepAliveFrame";
import { moveFrame } from "./moveFrame";
import { stopFrame } from "./stopFrame";

export default {
  id: "osoyooBase",
  name: "Osoyoo Base",
  frames: [keepAliveFrame, moveFrame, stopFrame],
};
