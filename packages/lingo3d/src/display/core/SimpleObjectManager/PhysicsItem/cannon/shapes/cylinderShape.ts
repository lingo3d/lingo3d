import getActualScale from "../../../../../utils/getActualScale"
import PhysicsItem from "../.."
import loadCannon from "../loadCannon"

export default async function (this: PhysicsItem) {
    const { Cylinder } = await loadCannon()
    const { x, y } = getActualScale(this)
    const radius = x * 0.5
    const shape = new Cylinder(radius, radius, y)
    this.cannonBody!.addShape(shape)
}