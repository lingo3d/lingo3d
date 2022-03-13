import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { renderer } from "../../renderer"
import renderPass from "../../effectComposer/renderPass"
import bloomPass from "../bloomPass"
import { getResolution } from "../../../../states/useResolution"

const selectiveBloomComposer = new EffectComposer(renderer)
getResolution(([w, h]) => selectiveBloomComposer.setSize(w, h))
selectiveBloomComposer.renderToScreen = false
export default selectiveBloomComposer

selectiveBloomComposer.addPass(renderPass)
selectiveBloomComposer.addPass(bloomPass)