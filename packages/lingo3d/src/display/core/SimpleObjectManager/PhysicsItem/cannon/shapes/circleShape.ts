import getActualScale from "../../../../../utils/getActualScale"
import PhysicsItem from "../.."
import loadCannon from "../loadCannon"

export default async function (this: PhysicsItem) {
    const { Sphere } = await loadCannon()
    this.cannonBody!.addShape(new Sphere(getActualScale(this).x * 0.5))
}