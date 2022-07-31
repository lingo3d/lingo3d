import store, { createEffect } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { getCameraRendered } from "./useCameraRendered"
import { getSelectionEnabled } from "./useSelectionEnabled"

export const [setEditorActive, getEditorActive] = store(false)

createEffect(() => {
    setEditorActive(getSelectionEnabled() && getCameraRendered() === mainCamera)
}, [getSelectionEnabled, getCameraRendered])
