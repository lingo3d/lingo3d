import store, { createEffect } from "@lincode/reactivity"
import { getBokehRefresh } from "./useBokehRefresh"
import { getCameraRendered } from "./useCameraRendered"

export const bokehFocusDefault = 1

export const [setBokehFocus, getBokehFocus] = store(bokehFocusDefault)

createEffect(() => {
    setBokehFocus(getCameraRendered().userData.bokehFocus ?? bokehFocusDefault)

}, [getCameraRendered, getBokehRefresh])