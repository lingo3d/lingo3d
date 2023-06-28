import store from "@lincode/reactivity"
import { worldModePtr } from "../pointers/worldModePtr"

export const [setWorldMode, getWorldMode] = store<
    "default" | "editor" | "runtime"
>("default")

getWorldMode((val) => (worldModePtr[0] = val))
