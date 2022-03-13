import store from "@lincode/reactivity"
import { getCamera } from "./useCamera"

export const [setBokeh, getBokeh] = store(false)

getCamera(cam => setBokeh(!!cam.userData.bokeh))