import store from "@lincode/reactivity"
import { getCamera } from "./useCamera"

export const [setBokehAperture, getBokehAperture] = store(0.025)

getCamera(cam => setBokehAperture(cam.userData.bokehAperture ?? 0.025))