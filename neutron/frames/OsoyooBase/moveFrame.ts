import { IFrame } from "../../interfaces/frames"

const moveFrame: IFrame = {
    id: "move",
    name: "Move",
    build: (body: any) => {
        return {
            id: "move",
            methodType: "publishLoop",
            method: "set_velocity",
            payload: body,
        }
    }
}

export {
    moveFrame,
}