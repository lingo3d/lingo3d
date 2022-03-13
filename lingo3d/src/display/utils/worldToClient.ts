import { Point } from "@lincode/math"
import { Object3D } from "three"
import Point3d from "../../api/Point3d"
import { scaleDown } from "../../engine/constants"
import { outline } from "../../engine/render/renderer"
import { getCamera } from "../../states/useCamera"
import { vector3 } from "./reusables"

const cache = new WeakMap<Object3D | Point3d, Point>()

export default (object3d: Object3D | Point3d) => {
    if (cache.has(object3d))
        return cache.get(object3d)!

    if ("id" in object3d)
        object3d.getWorldPosition(vector3)
    else
        vector3.set(object3d.x * scaleDown, object3d.y * scaleDown, object3d.z * scaleDown)
    
    const camera = getCamera()
    vector3.project(camera)
    
    const x = (vector3.x *  .5 + .5) * outline.clientWidth
    const y = (vector3.y * -.5 + .5) * outline.clientHeight

    const result = { x, y }

    cache.set(object3d, result)
    queueMicrotask(() => cache.delete(object3d))

    return result
}