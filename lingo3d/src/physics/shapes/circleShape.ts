import getActualScale from "../../display/utils/getActualScale"
import PhysicsItem from "../../display/core/SimpleObjectManager/PhysicsItem"
import loadCannon from "../loadCannon"

export default async (target: PhysicsItem) => {
    const { Sphere } = await loadCannon()
    target.physicsBody!.addShape(new Sphere(getActualScale(target).x * 0.5))
}