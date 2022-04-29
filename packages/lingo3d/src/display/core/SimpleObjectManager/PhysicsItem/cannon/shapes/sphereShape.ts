import getActualScale from "../../../../../utils/getActualScale"
import PhysicsItem from "../.."
import loadCannon from "../loadCannon"

export default async function (this: PhysicsItem) {
    const { Sphere } = await loadCannon()

    const shape = new Sphere(getActualScale(this).x * 0.5)
    this.cannonBody!.addShape(shape)
}