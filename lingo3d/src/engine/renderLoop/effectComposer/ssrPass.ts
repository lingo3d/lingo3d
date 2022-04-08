import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass"
import scene from "../../scene"
import { getCamera } from "../../../states/useCamera"
import { Mesh, Object3D } from "three"
import { pull } from "@lincode/utils"
import { getSSRGroundReflector } from "../../../states/useSSRGroundReflector"
import { HEIGHT, WIDTH } from "../../../globals"
import { getRenderer } from "../../../states/useRenderer"

export const ssrPtr = [false]

const ssrSelects: Array<Mesh> = []

export const addSSR = (target: Object3D) => {
    if (target.userData.ssr) return
    target.userData.ssr = true
    ssrSelects.push(target as Mesh)
    ssrPtr[0] = true
}

export const deleteSSR = (target: Object3D) => {
    if (!target.userData.ssr) return
    target.userData.ssr = false
    pull(ssrSelects, target as Mesh)
}

const ssrPass = new SSRPass({
    renderer: getRenderer(),
    scene,
    camera: getCamera(),
    width: WIDTH,
    height: HEIGHT,
    groundReflector: getSSRGroundReflector(),
    selects: ssrSelects
})
export default ssrPass

getRenderer(renderer => ssrPass.renderer = renderer)
getCamera(camera => ssrPass.camera = camera)
getSSRGroundReflector(reflector => {
    ssrPass.groundReflector = reflector
    reflector && (ssrPtr[0] = true)
})