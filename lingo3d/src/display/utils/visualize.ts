import { Point3d } from "@lincode/math"
import { forceGet } from "@lincode/utils"
import { Sphere } from "../.."

const sphereMap = new Map<string, Sphere>()

export default (name: string, pt: Point3d) => {
    const sphere = forceGet(sphereMap, name, () => new Sphere())
    sphere.placeAt(pt)
    return sphere
}
