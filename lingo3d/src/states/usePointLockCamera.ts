import store from "@lincode/reactivity"
import { PerspectiveCamera } from "three"

export const [setPointerLockCamera, getPointerLockCamera] = store<PerspectiveCamera | undefined>(undefined)