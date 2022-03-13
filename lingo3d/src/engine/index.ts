import boxHelper from "./boxHelper"
import mainOrbitControls from "./mainOrbitControls"
import transformControls from "./transformControls"
import gridHelper from "./gridHelper"
import referencePlane from "./referencePlane"
import skyShader from "./skyShader"
import render from "./render"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake([render, skyShader, referencePlane, gridHelper, transformControls, mainOrbitControls, boxHelper])

export default {}