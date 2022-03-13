import getActualScale from "../../display/utils/getActualScale"
import PhysicsItem from "../../display/core/SimpleObjectManager/PhysicsItem"
import loadCannon from "../loadCannon"

export default async (target: PhysicsItem) => {
    const { Sphere, Cylinder, Vec3 } = await loadCannon()

    const { x, y } = getActualScale(target)
    const radius = x * 0.5
    const halfHeight = y * 0.5
    const shape0 = new Sphere(radius)
    const shape1 = new Sphere(radius)
    const shape2 = new Cylinder(radius, radius, Math.abs(y - x))

    target.physicsBody!.addShape(shape0, new Vec3(0, -halfHeight + radius, 0))
    target.physicsBody!.addShape(shape1, new Vec3(0, halfHeight - radius, 0))
    target.physicsBody!.addShape(shape2)
}