import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass"
import { renderer } from "../renderer"
import scene from "../../scene"
import { getCamera } from "../../../states/useCamera"
import { Mesh, Object3D } from "three"
import { pull } from "@lincode/utils"
import { getSSRGroundReflector } from "../../../states/useSSRGroundReflector"
import { HEIGHT, WIDTH } from "../../../globals"
import { getResolution } from "../../../states/useResolution"

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

const ssrPass = new SSRPass( {
    renderer,
    scene,
    camera: getCamera(),
    width: WIDTH,
    height: HEIGHT,
    groundReflector: getSSRGroundReflector(),
    selects: ssrSelects
})
export default ssrPass

getCamera(camera => ssrPass.camera = camera)
getSSRGroundReflector(reflector => {
    ssrPass.groundReflector = reflector
    reflector && (ssrPtr[0] = true)
})
getResolution(([w, h]) => ssrPass.setSize(w, h))