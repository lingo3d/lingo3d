import store, { createEffect } from "@lincode/reactivity"
import { isPositionedItem } from "../api/core/PositionedItem"
import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { getSelectionTarget } from "./useSelectionTarget"
import { getTransformControlsMode } from "./useTransformControlsMode"

export const [
    setTransformControlsModeComputed,
    getTransformControlsModeComputed
] = store(getTransformControlsMode())

createEffect(() => {
    let mode = getTransformControlsMode()
    const target = getSelectionTarget()
    if (target)
        if (!isPositionedItem(target)) mode = "select"
        else if (!(target instanceof SimpleObjectManager)) mode = "translate"

    setTransformControlsModeComputed(mode)
}, [getTransformControlsMode, getSelectionTarget])
