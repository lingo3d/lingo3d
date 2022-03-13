import store from "@lincode/reactivity"
import { getCamera } from "./useCamera"

export const [setBokehMaxBlur, getBokehMaxBlur] = store(0.01)

getCamera(cam => setBokehMaxBlur(cam.userData.bokehMaxBlur ?? 0.01))