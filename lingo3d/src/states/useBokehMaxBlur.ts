import store, { createEffect } from "@lincode/reactivity"
import { getBokehRefresh } from "./useBokehRefresh"
import { getCameraRendered } from "./useCameraRendered"

export const bokehMaxBlurDefault = 0.01

export const [setBokehMaxBlur, getBokehMaxBlur] = store(bokehMaxBlurDefault)

createEffect(() => {
    setBokehMaxBlur(getCameraRendered().userData.bokehMaxBlur ?? bokehMaxBlurDefault)

}, [getCameraRendered, getBokehRefresh])