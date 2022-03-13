import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader"
import { getResolution } from "../../../states/useResolution"
import { renderer } from "../renderer"

const fxaaPass = new ShaderPass(FXAAShader)
export default fxaaPass

getResolution(([w, h]) => {
    const pixelRatio = renderer.getPixelRatio()
    fxaaPass.material.uniforms["resolution"].value.x = 1 / (w * pixelRatio)
    fxaaPass.material.uniforms["resolution"].value.y = 1 / (h * pixelRatio)
})