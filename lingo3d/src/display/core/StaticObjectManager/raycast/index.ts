import useRaycastPlay from "./useRaycastPlay"
import useRaycastPath from "./useRaycastPath"
import useRaycastEdit from "./useRaycastEdit"
import { createEffect } from "@lincode/reactivity"
import { getEditing } from "../../../../states/useEditing"
import { getEditorMode } from "../../../../states/useEditorMode"
import { getMultipleSelection } from "../../../../states/useMultipleSelection"
import { getTransformControlsDragging } from "../../../../states/useTransformControlsDragging"

createEffect(() => {
    useRaycastPlay()
    useRaycastPath()
    useRaycastEdit()
}, [
    getEditing,
    getEditorMode,
    getTransformControlsDragging,
    getMultipleSelection
])
