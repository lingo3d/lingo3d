import getActualScale from "../../display/utils/getActualScale"
import { Vector3 } from "three"
import PhysicsItem from "../../display/core/SimpleObjectManager/PhysicsItem"
import loadCannon from "../loadCannon"

export default async (target: PhysicsItem) => {
    const { Box, Vec3 } = await loadCannon()

    const actualScale = getActualScale(target)
    const scale0 = actualScale.clone().multiply(new Vector3(0.15, 0.5, 0.1))
    const scale1 = actualScale.clone().multiply(new Vector3(0.5, 0.15, 0.1))

    const shape0 = new Box(scale0 as any)
    const shape1 = new Box(scale1 as any)

    target.physicsBody!.addShape(shape0, new Vec3(-scale1.x, 0, 0))
    target.physicsBody!.addShape(shape0, new Vec3(scale1.x, 0, 0))

    target.physicsBody!.addShape(shape1, new Vec3(0, -scale0.y, 0))
    target.physicsBody!.addShape(shape1, new Vec3(0, scale0.y, 0))
}