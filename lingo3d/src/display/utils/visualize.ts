import { forceGet } from "@lincode/utils"
import { Sphere } from "../.."
import IPrimitive from "../../interface/IPrimitive"
import { Point3dType } from "../../typeGuards/isPoint"
import { Vector3 } from "three"
import { vec2Point } from "./vec2Point"
import { createUnloadMap } from "../../utils/createUnloadMap"

const sphereMap = createUnloadMap<string, Sphere>()

export default (
    name: string,
    pt?: Point3dType | Vector3,
    properties?: Partial<IPrimitive>
) => {
    const sphere = forceGet(sphereMap, name, () => {
        const sphere = Object.assign(new Sphere(), properties)
        sphere.$ghost()
        return sphere
    })
    if (pt) {
        sphere.placeAt(pt instanceof Vector3 ? vec2Point(pt) : pt)
        sphere.visible = true
    } else sphere.visible = false
    return sphere
}
