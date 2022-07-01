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
    fxaaPass.material.uniforms["resolution"].value.set(1 / (w * pixelRatio), 1 / (h * pixelRatio))

}, [getPixelRatioComputed, getResolution])