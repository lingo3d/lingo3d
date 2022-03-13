import store from "@lincode/reactivity"
import { getCamera } from "./useCamera"

export const [setBokehFocus, getBokehFocus] = store(1)

getCamera(cam => setBokehFocus(cam.userData.bokehFocus ?? 1))