import store, { createEffect } from "@lincode/reactivity"
import { getBokehRefresh } from "./useBokehRefresh"
import { getCameraRendered } from "./useCameraRendered"

export const bokehApertureDefault = 0.025

export const [setBokehAperture, getBokehAperture] = store(bokehApertureDefault)

createEffect(() => {
    setBokehAperture(getCameraRendered().userData.bokehAperture ?? bokehApertureDefault)

}, [getCameraRendered, getBokehRefresh])