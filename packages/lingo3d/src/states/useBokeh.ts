import store from "@lincode/reactivity"
import { getCamera } from "./useCamera"

export const bokehDefault = false

export const [setBokeh, getBokeh] = store(bokehDefault)

getCamera(cam => setBokeh(cam.userData.bokeh ?? bokehDefault))