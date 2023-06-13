import { forceGet } from "@lincode/utils"
import { Sphere } from "../.."
import IPrimitive from "../../interface/IPrimitive"
import { Point3dType } from "../../utils/isPoint"

const sphereMap = new Map<string, Sphere>()

export default (
    name: string,
    pt?: Point3dType,
    properties?: Partial<IPrimitive>
) => {
    const sphere = forceGet(sphereMap, name, () => {
        const sphere = Object.assign(new Sphere(), properties)
        sphere.$ghost()
        return sphere
    })
    pt && sphere.placeAt(pt)
    return sphere
}
