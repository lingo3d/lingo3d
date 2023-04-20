import store from "@lincode/reactivity"
import { shadowModePtr } from "../pointers/shadowModePtr"

export const [setShadowMode, getShadowMode] = store<boolean | "physics">(true)

getShadowMode((val) => (shadowModePtr[0] = val))
