import { IFrame } from "../../interfaces/frames"
import { IMovementMatrix } from "../../interfaces/robotbase"

const moveFrame: IFrame = {
    id: "move",
    name: "Move",
    build: (body: IMovementMatrix) => {
        return {
            id: "move",
            methodType: "publish",
            method: "set_velocity",
            payload: body,
        }
    }
}

export {
    moveFrame,
}