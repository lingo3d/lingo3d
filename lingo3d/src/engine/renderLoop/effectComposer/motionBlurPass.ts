import { SavePass } from "three/examples/jsm/postprocessing/SavePass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { BlendShader } from "three/examples/jsm/shaders/BlendShader"
import { CopyShader } from "three/examples/jsm/shaders/CopyShader"
import { getMotionBlurStrength } from "../../../states/useMotionBlurStrength"

const savePass = new SavePass()

const blendPass = new ShaderPass(BlendShader, "tDiffuse1")
blendPass.uniforms["tDiffuse2"].value = savePass.renderTarget.texture
getMotionBlurStrength(value => blendPass.uniforms["mixRatio"].value = value)

const outputPass = new ShaderPass(CopyShader)
outputPass.renderToScreen = true

export default [blendPass, savePass, outputPass]