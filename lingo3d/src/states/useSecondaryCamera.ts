import store from "@lincode/reactivity"
import { PerspectiveCamera } from "three"

export const [setSecondaryCamera, getSecondaryCamera] = store<PerspectiveCamera | undefined>(undefined)