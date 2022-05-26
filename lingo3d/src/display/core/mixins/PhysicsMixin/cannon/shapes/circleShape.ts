import getActualScale from "../../../../../utils/getActualScale"
import PhysicsMixin from "../.."
import loadCannon from "../loadCannon"

export default async function (this: PhysicsMixin) {
    const { Sphere } = await loadCannon()
    this.cannonBody!.addShape(new Sphere(getActualScale(this).x * 0.5))
}