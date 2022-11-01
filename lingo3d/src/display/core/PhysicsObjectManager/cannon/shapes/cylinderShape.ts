import PhysicsObjectManager from "../.."
import getActualScale from "../../../../utils/getActualScale"

export default async function (this: PhysicsObjectManager) {
    const { Cylinder } = await import("cannon-es")
    const { x, y } = getActualScale(this)
    const radius = x * 0.5
    const shape = new Cylinder(radius, radius, y)
    this.cannonBody!.addShape(shape)
}
