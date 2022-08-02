import store, { createEffect } from "@lincode/reactivity"
import { isPositionedItem } from "../api/core/PositionedItem"
import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { getSelectionEnabled } from "./useSelectionEnabled"
import { getSelectionTarget } from "./useSelectionTarget"
import {
    getTransformControlsMode,
    TransformControlsMode
} from "./useTransformControlsMode"

export const [
    setTransformControlsModeComputed,
    getTransformControlsModeComputed
] = store<TransformControlsMode | "none">(getTransformControlsMode())

createEffect(() => {
    if (!getSelectionEnabled()) {
        setTransformControlsModeComputed("none")
        return
    }
    const target = getSelectionTarget()
    if (target)
        if (!isPositionedItem(target)) {
            setTransformControlsModeComputed("select")
            return
        } else if (!(target instanceof SimpleObjectManager)) {
            setTransformControlsModeComputed("translate")
            return
        }
    setTransformControlsModeComputed(getTransformControlsMode())
}, [getTransformControlsMode, getSelectionTarget, getSelectionEnabled])
