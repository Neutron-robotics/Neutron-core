import { IFrame } from "../../interfaces/frames";

const stopFrame: IFrame = {
    id: "stop",
    name: "Stop",
    build: (body: any) => {
        return {
            id: "stop",
            methodType: "publish",
            method: "stop",
            payload: body,
        }
    }
}

export {
    stopFrame,
}   