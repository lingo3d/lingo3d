import getActualScale from "../../../../../utils/getActualScale"
import PhysicsItem from "../.."
import loadCannon from "../loadCannon"

export default async function (this: PhysicsItem) {
    const { Sphere, Cylinder, Vec3 } = await loadCannon()

    const { x, y } = getActualScale(this)
    const radius = x * 0.5
    const halfHeight = y * 0.5
    const shape0 = new Sphere(radius)
    const shape1 = new Sphere(radius)
    const shape2 = new Cylinder(radius, radius, Math.abs(y - x))

    this.cannonBody!.addShape(shape0, new Vec3(0, -halfHeight + radius, 0))
    this.cannonBody!.addShape(shape1, new Vec3(0, halfHeight - radius, 0))
    this.cannonBody!.addShape(shape2)
}