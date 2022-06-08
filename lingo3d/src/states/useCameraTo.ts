import store from "@lincode/reactivity"
import { PerspectiveCamera } from "three"

export const [setCameraTo, getCameraTo] = store<PerspectiveCamera | undefined>(undefined)