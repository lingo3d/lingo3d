import useRaycastPlay from "./useRaycastPlay"
import useRaycastCurve from "./useRaycastCurve"
import useRaycastEdit from "./useRaycastEdit"
import { createEffect } from "@lincode/reactivity"
import { getEditing } from "../../../../states/useEditing"
import { getEditorMode } from "../../../../states/useEditorMode"
import { getMultipleSelection } from "../../../../states/useMultipleSelection"
import { getTransformControlsDragging } from "../../../../states/useTransformControlsDragging"

createEffect(() => {
    useRaycastPlay()
    useRaycastEdit()
    useRaycastCurve()
}, [
    getEditing,
    getEditorMode,
    getTransformControlsDragging,
    getMultipleSelection
])
