import { Point } from "@lincode/math"
import { Object3D } from "three"
import { container } from "../../engine/renderLoop/renderSetup"
import { getCameraRendered } from "../../states/useCameraRendered"
import getCenter from "./getCenter"
import { vector3 } from "./reusables"

const cache = new WeakMap<Object3D, Point>()

export default (object3d: Object3D) => {
    if (cache.has(object3d))
        return cache.get(object3d)!

    getCenter(object3d)
    
    const camera = getCameraRendered()
    vector3.project(camera)
    
    const x = (vector3.x *  .5 + .5) * container.clientWidth
    const y = (vector3.y * -.5 + .5) * container.clientHeight

    const result = { x, y }

    cache.set(object3d, result)
    setTimeout(() => cache.delete(object3d))

    return result
}