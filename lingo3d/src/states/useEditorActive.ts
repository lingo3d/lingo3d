import store, { createEffect } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { getCamera } from "./useCamera"
import { getSelection } from "./useSelection"

export const [setEditorActive, getEditorActive] = store(false)

createEffect(() => {
    setEditorActive(getSelection() && getCamera() === mainCamera)

}, [getSelection, getCamera])