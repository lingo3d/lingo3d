import store, { createEffect } from "@lincode/reactivity"
import { getEditorModeComputed } from "./useEditorModeComputed"
import { getTransformControlsSpace } from "./useTransformControlsSpace"

export const [
    setTransformControlsSpaceComputed,
    getTransformControlsSpaceComputed
] = store(getTransformControlsSpace())

createEffect(() => {
    if (getEditorModeComputed() === "scale")
        setTransformControlsSpaceComputed("local")
    else setTransformControlsSpaceComputed(getTransformControlsSpace())
}, [getTransformControlsSpace, getEditorModeComputed])
