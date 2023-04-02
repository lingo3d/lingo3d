import store from "@lincode/reactivity"
import { gravityPtr } from "../pointers/gravityPtr"

export const [setGravity, getGravity] = store(-9.81)

getGravity((val) => (gravityPtr[0] = val))
