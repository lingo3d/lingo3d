import store, { createEffect } from "@lincode/reactivity"
import { getBokehRefresh } from "./useBokehRefresh"
import { getCameraRendered } from "./useCameraRendered"

export const bokehDefault = false

export const [setBokeh, getBokeh] = store(bokehDefault)

createEffect(() => {
    setBokeh(getCameraRendered().userData.bokeh ?? bokehDefault)

}, [getCameraRendered, getBokehRefresh])