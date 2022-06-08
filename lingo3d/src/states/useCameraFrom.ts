import store from "@lincode/reactivity"
import { PerspectiveCamera } from "three"

export const [setCameraFrom, getCameraFrom] = store<PerspectiveCamera | undefined>(undefined)