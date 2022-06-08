import store, { createEffect } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { getCameraRendered } from "./useCameraRendered"
import { getSelection } from "./useSelection"

export const [setEditorActive, getEditorActive] = store(false)

createEffect(() => {
    setEditorActive(getSelection() && getCameraRendered() === mainCamera)

}, [getSelection, getCameraRendered])