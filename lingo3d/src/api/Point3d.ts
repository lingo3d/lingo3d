import worldToClient from "../display/utils/worldToClient"

export default class Point3d {
    public constructor(
        public x: number,
        public y: number,
        public z: number
    ) {}

    public get clientX() {
        return worldToClient(this).x
    }

    public get clientY() {
        return worldToClient(this).y
    }
}