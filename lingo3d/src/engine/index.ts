import boxHelper from "./boxHelper"
import skeletonHelper from "./skeletonHelper"
import mainOrbitControls from "./mainOrbitCamera"
import transformControls from "./transformControls"
import gridHelper from "./gridHelper"
import referencePlane from "./referencePlane"
import skyShader from "./skyShader"
import render from "./renderLoop"
import background from "./background"
import defaultLight from "./defaultLight"
import { preventTreeShake } from "@lincode/utils"
import { setDebug } from "../states/useDebug"
import applySetup from "./applySetup"

preventTreeShake([
    render,
    skyShader,
    referencePlane,
    gridHelper,
    transformControls,
    mainOrbitControls,
    boxHelper,
    skeletonHelper,
    background,
    defaultLight,
    applySetup
])

export default {}

const w = window as any
"__THREE__" in w && (w.__THREE__ += " - Lingo3D Beta")
w.setDebug = setDebug

"__LINGO3D__" in w && console.warn("multiple versions of Lingo3D detected")
w.__LINGO3D__ = true
