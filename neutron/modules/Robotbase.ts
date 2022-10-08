import { IRobotConnectionContext } from "../context/RosContext.ts.bak";
import { IBatteryInfo } from "../interfaces/RobotConnection";
import { inRange } from "../utils/math";

export type Direction = "forward" | "backward" | "left" | "right";

export interface IRobotBaseConfiguration {
    id: string;
    name: string;
    directionnalSpeed: number;
    rotationSpeed: number;
}

export abstract class RobotBase {

    public id: string;

    public name: string;

    public configuration: IRobotBaseConfiguration;

    public batteryInfo: IBatteryInfo;

    public speed: number;

    protected abstract context: IRobotConnectionContext;

    constructor(id: string, name: string, configuration: IRobotBaseConfiguration) {
        this.name = name;
        this.configuration = configuration;
        if (!inRange(configuration.directionnalSpeed, 0, 1) || !inRange(configuration.rotationSpeed, 0, 1)) 
            throw new Error("Invalid speed configuration: speed range is [0, 1]");
        this.id = id;
        this.batteryInfo = {
            level: -1,
            measurement: "percent",
            charging: false,
        };
        this.speed = 50;
    }

    public abstract move(direction: Direction): void;

    public abstract stop(): void;

    public abstract rotate(direction: Direction): void;

    public abstract setSpeed(speed: number): void
}