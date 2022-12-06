import store from "@lincode/reactivity"
import { PerspectiveCamera } from "three"

export const [setEditorCamera, getEditorCamera] = store<
    PerspectiveCamera | undefined
>(undefined)
