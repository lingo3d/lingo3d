import store from "@lincode/reactivity"
import { getCamera } from "./useCamera"

export const bokehMaxBlurDefault = 0.01

export const [setBokehMaxBlur, getBokehMaxBlur] = store(bokehMaxBlurDefault)

getCamera(cam => setBokehMaxBlur(cam.userData.bokehMaxBlur ?? bokehMaxBlurDefault))