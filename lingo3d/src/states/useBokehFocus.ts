import store, { createEffect } from "@lincode/reactivity"
import { getBokehRefresh } from "./useBokehRefresh"
import { getCamera } from "./useCamera"
import { getCameraRendered } from "./useCameraRendered"

export const bokehFocusDefault = 1

export const [setBokehFocus, getBokehFocus] = store(bokehFocusDefault)

createEffect(() => {
    setBokehFocus(getCamera().userData.bokehFocus ?? bokehFocusDefault)

}, [getCameraRendered, getBokehRefresh])