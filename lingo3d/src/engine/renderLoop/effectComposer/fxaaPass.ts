import { createEffect } from "@lincode/reactivity"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader"
import { getPixelRatioComputed } from "../../../states/usePixelRatioComputed"
import { getResolution } from "../../../states/useResolution"

const fxaaPass = new ShaderPass(FXAAShader)
export default fxaaPass

createEffect(() => {
    const [w, h] = getResolution()
    const pixelRatio = getPixelRatioComputed()
    fxaaPass.material.uniforms["resolution"].value.x = 1 / (w * pixelRatio)
    fxaaPass.material.uniforms["resolution"].value.y = 1 / (h * pixelRatio)

}, [getPixelRatioComputed, getResolution])