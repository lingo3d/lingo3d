import store, { createEffect } from "@lincode/reactivity"
import { PerspectiveCamera } from "three"
import interpolationCamera from "../engine/interpolationCamera"
import mainCamera from "../engine/mainCamera"
import { getCamera } from "./useCamera"
import { getCameraInterpolate } from "./useCameraInterpolate"

export const [setCameraRendered, getCameraRendered] = store<PerspectiveCamera>(mainCamera)

createEffect(() => {
    setCameraRendered(getCameraInterpolate() ? interpolationCamera : getCamera())

}, [getCamera, getCameraInterpolate])