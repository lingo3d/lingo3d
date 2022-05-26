import getActualScale from "../../../../../utils/getActualScale"
import PhysicsMixin from "../.."
import loadCannon from "../loadCannon"

export default async function (this: PhysicsMixin) {
    const { Sphere } = await loadCannon()

    const shape = new Sphere(getActualScale(this).x * 0.5)
    this.cannonBody!.addShape(shape)
}