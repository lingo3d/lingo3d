import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { renderer } from "../../renderer"
import renderPass from "../../effectComposer/renderPass"
import bloomPass from "../bloomPass"

const selectiveBloomComposer = new EffectComposer(renderer)
selectiveBloomComposer.renderToScreen = false
export default selectiveBloomComposer

selectiveBloomComposer.addPass(renderPass)
selectiveBloomComposer.addPass(bloomPass)