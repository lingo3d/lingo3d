import store from "@lincode/reactivity"
import { getCamera } from "./useCamera"

export const bokehFocusDefault = 1

export const [setBokehFocus, getBokehFocus] = store(bokehFocusDefault)

getCamera(cam => setBokehFocus(cam.userData.bokehFocus ?? bokehFocusDefault))