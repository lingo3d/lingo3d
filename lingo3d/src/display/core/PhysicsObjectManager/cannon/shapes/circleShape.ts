import PhysicsObjectManager from "../.."
import getActualScale from "../../../../utils/getActualScale"
import loadCannon from "../loadCannon"

export default async function (this: PhysicsObjectManager) {
    const { Sphere } = await loadCannon()
    this.cannonBody!.addShape(new Sphere(getActualScale(this).x * 0.5))
}
