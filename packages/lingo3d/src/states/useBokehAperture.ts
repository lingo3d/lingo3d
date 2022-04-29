import store from "@lincode/reactivity"
import { getCamera } from "./useCamera"

export const bokehApertureDefault = 0.025

export const [setBokehAperture, getBokehAperture] = store(bokehApertureDefault)

getCamera(cam => setBokehAperture(cam.userData.bokehAperture ?? bokehApertureDefault))