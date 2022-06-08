import store, { createEffect } from "@lincode/reactivity"
import { PerspectiveCamera } from "three"
import interpolationCamera from "../engine/interpolationCamera"
import mainCamera from "../engine/mainCamera"
import { getCameraStack } from "./useCameraStack"
import { getCameraInterpolate } from "./useCameraInterpolate"
import { last } from "@lincode/utils"

export const [setCameraRendered, getCameraRendered] = store<PerspectiveCamera>(mainCamera)

createEffect(() => {
    setCameraRendered(getCameraInterpolate() ? interpolationCamera : last(getCameraStack())!)

}, [getCameraStack, getCameraInterpolate])