import store, { createEffect } from "@lincode/reactivity"
import { getEditorMode } from "./useEditorMode"
import { getTransformControlsSpace } from "./useTransformControlsSpace"

export const [
    setTransformControlsSpaceComputed,
    getTransformControlsSpaceComputed
] = store(getTransformControlsSpace())

createEffect(() => {
    if (getEditorMode() === "scale") setTransformControlsSpaceComputed("local")
    else setTransformControlsSpaceComputed(getTransformControlsSpace())
}, [getTransformControlsSpace, getEditorMode])
