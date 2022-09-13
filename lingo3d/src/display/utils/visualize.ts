import { Point3d } from "@lincode/math"
import { forceGet } from "@lincode/utils"
import { Sphere } from "../.."
import IPrimitive from "../../interface/IPrimitive"

const sphereMap = new Map<string, Sphere>()

export default (name: string, pt: Point3d, properties?: IPrimitive) => {
    const sphere = forceGet(sphereMap, name, () =>
        Object.assign(new Sphere(), properties)
    )
    sphere.placeAt(pt)
    return sphere
}
