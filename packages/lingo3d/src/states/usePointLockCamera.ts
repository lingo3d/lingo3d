import store from "@lincode/reactivity"
import { Camera } from "three"

export const [setPointerLockCamera, getPointerLockCamera] = store<Camera | undefined>(undefined)