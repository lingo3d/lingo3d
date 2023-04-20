import store from "@lincode/reactivity"
import { shadowPtr } from "../pointers/shadowPtr"

export const [setShadowMode, getShadowMode] = store<boolean | "physics">(true)

getShadowMode((val) => (shadowPtr[0] = val === true))
