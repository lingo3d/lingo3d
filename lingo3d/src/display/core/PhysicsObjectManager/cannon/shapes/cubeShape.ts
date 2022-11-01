import PhysicsObjectManager from "../.."
import getActualScale from "../../../../utils/getActualScale"

export default async function (this: PhysicsObjectManager) {
    const { Box } = await import("cannon-es")
    this.cannonBody!.addShape(
        new Box(getActualScale(this).multiplyScalar(0.5) as any)
    )
}
