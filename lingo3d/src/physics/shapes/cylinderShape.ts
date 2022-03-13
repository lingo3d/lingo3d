import getActualScale from "../../display/utils/getActualScale"
import PhysicsItem from "../../display/core/SimpleObjectManager/PhysicsItem"
import loadCannon from "../loadCannon"

export default async (target: PhysicsItem) => {
    const { Cylinder } = await loadCannon()
    const { x, y } = getActualScale(target)
    const radius = x * 0.5
    const shape = new Cylinder(radius, radius, y)
    target.physicsBody!.addShape(shape)
}