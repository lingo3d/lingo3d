import { Point3d } from "@lincode/math"
import { forceGet } from "@lincode/utils"
import { Sphere } from "../.."
import IPrimitive from "../../interface/IPrimitive"
import { selectionDisabledSet } from "../../collections/selectionDisabledSet"

const sphereMap = new Map<string, Sphere>()

export default (
    name: string,
    pt: Point3d,
    properties?: Partial<IPrimitive>
) => {
    const sphere = forceGet(sphereMap, name, () => {
        const sphere = Object.assign(new Sphere(), properties)
        selectionDisabledSet.add(sphere)
        return sphere
    })
    sphere.placeAt(pt)
    return sphere
}
