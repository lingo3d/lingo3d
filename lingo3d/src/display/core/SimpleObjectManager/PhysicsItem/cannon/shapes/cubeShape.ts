import PhysicsItem from "../.."
import getActualScale from "../../../../../utils/getActualScale"
import loadCannon from "../loadCannon"

export default async function (this: PhysicsItem) {
    const { Box } = await loadCannon()
    this.cannonBody!.addShape(new Box(getActualScale(this).multiplyScalar(0.5) as any))
}