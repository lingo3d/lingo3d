import PhysicsItem from "../../display/core/SimpleObjectManager/PhysicsItem"
import getActualScale from "../../display/utils/getActualScale"
import loadCannon from "../loadCannon"

export default async (target: PhysicsItem) => {
    const { Box } = await loadCannon()
    target.physicsBody!.addShape(new Box(getActualScale(target).multiplyScalar(0.5) as any))
}