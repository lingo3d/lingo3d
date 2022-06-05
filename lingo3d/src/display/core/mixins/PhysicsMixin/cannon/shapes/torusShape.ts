import getActualScale from "../../../../../utils/getActualScale"
import PhysicsMixin from "../.."
import loadCannon from "../loadCannon"
import { vector3, vector3_ } from "../../../../../utils/reusables"

export default async function (this: PhysicsMixin) {
    const { Box, Vec3 } = await loadCannon()

    const actualScale = getActualScale(this)
    const scale0 = actualScale.clone().multiply(vector3.set(0.15, 0.5, 0.1))
    const scale1 = actualScale.clone().multiply(vector3_.set(0.5, 0.15, 0.1))

    const shape0 = new Box(scale0 as any)
    const shape1 = new Box(scale1 as any)

    this.cannonBody!.addShape(shape0, new Vec3(-scale1.x, 0, 0))
    this.cannonBody!.addShape(shape0, new Vec3(scale1.x, 0, 0))

    this.cannonBody!.addShape(shape1, new Vec3(0, -scale0.y, 0))
    this.cannonBody!.addShape(shape1, new Vec3(0, scale0.y, 0))
}