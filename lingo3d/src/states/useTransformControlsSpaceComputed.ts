import store, { createEffect } from "@lincode/reactivity"
import { getTransformControlsMode } from "./useTransformControlsMode"
import { getTransformControlsSpace } from "./useTransformControlsSpace"

export const [
    setTransformControlsSpaceComputed,
    getTransformControlsSpaceComputed
] = store(getTransformControlsSpace())

createEffect(() => {
    if (getTransformControlsMode() === "scale")
        setTransformControlsSpaceComputed("local")
    else setTransformControlsSpaceComputed(getTransformControlsSpace())
}, [getTransformControlsSpace, getTransformControlsMode])
