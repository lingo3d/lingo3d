import { Point } from "@lincode/math"
import { Object3D } from "three"
import { container } from "../../engine/renderLoop/renderSetup"
import { onAfterRender } from "../../events/onAfterRender"
import { getCameraRendered } from "../../states/useCameraRendered"
import getCenter from "./getCenter"

const cache = new WeakMap<Object3D, Point>()

//todo: might need cloning for caching

export default (object3d: Object3D) => {
    if (cache.has(object3d))
        return cache.get(object3d)!

    const center = getCenter(object3d)
    
    const camera = getCameraRendered()
    center.project(camera)
    
    const x = (center.x *  .5 + .5) * container.clientWidth
    const y = (center.y * -.5 + .5) * container.clientHeight

    const result = { x, y }

    cache.set(object3d, result)
    onAfterRender(() => cache.delete(object3d), true)

    return result
}