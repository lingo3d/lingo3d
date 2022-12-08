import "./polyfill"
import "./boxHelper"
import "./skeletonHelper"
import "./mainCameraManager"
import "./transformControls"
import "./gridHelper"
import "./referencePlane"
import "./skyShader"
import "./renderLoop"
import "./background"
import "./defaultLight"
import "./applySetup"
import { VERSION } from "../globals"

const w = window as any
"__THREE__" in w && (w.__THREE__ += " - Lingo3D Beta " + VERSION)

"__LINGO3D__" in w && console.warn("multiple versions of Lingo3D detected")
w.__LINGO3D__ = true
