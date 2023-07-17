import store from "@lincode/reactivity"
import { worldModePtr } from "../pointers/worldModePtr"
import { emitWorldMode } from "../events/onWorldMode"

export type WorldMode = "default" | "editor" | "runtime"

export const [setWorldMode, getWorldMode] = store<WorldMode>("default")

getWorldMode((val) => emitWorldMode((worldModePtr[0] = val)))
