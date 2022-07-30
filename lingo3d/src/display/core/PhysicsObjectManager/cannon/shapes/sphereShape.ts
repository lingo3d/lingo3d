import PhysicsObjectManager from "../.."
import getActualScale from "../../../../utils/getActualScale"
import loadCannon from "../loadCannon"

export default async function (this: PhysicsObjectManager) {
    const { Sphere } = await loadCannon()

    const shape = new Sphere(getActualScale(this).x * 0.5)
    this.cannonBody!.addShape(shape)
}
