import { SAOPass } from "three/examples/jsm/postprocessing/SAOPass"
import { getAmbientOcclusion } from "../../../states/useAmbientOcclusion"
import { getCameraRendered } from "../../../states/useCameraRendered"
import scene from "../../scene"

const saoPass = new SAOPass(scene, getCameraRendered(), false, true)
export default saoPass

saoPass.params.saoKernelRadius = 80
saoPass.params.saoBlurStdDev = 5

getAmbientOcclusion(
    (ao) => (saoPass.params.saoScale = ao === "light" ? 3000 : 2000)
)
getCameraRendered((camera) => {
    saoPass.camera = camera
    saoPass.saoMaterial.defines["PERSPECTIVE_CAMERA"] =
        camera.isPerspectiveCamera ? 1 : 0
    saoPass.saoMaterial.uniforms["cameraInverseProjectionMatrix"].value.copy(
        camera.projectionMatrixInverse
    )
    saoPass.saoMaterial.uniforms["cameraProjectionMatrix"].value =
        camera.projectionMatrix
    saoPass.vBlurMaterial.defines["PERSPECTIVE_CAMERA"] =
        camera.isPerspectiveCamera ? 1 : 0
    saoPass.hBlurMaterial.defines["PERSPECTIVE_CAMERA"] =
        camera.isPerspectiveCamera ? 1 : 0
})
