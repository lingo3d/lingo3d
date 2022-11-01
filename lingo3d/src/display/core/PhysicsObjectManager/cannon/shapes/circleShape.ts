import PhysicsObjectManager from "../.."
import getActualScale from "../../../../utils/getActualScale"

export default async function (this: PhysicsObjectManager) {
    const { Sphere } = await import("cannon-es")
    this.cannonBody!.addShape(new Sphere(getActualScale(this).x * 0.5))
}
