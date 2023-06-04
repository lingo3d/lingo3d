import store from "@lincode/reactivity"
import { worldPlayPtr } from "../pointers/worldPlayPtr"

export const [setWorldPlay, getWorldPlay] = store<
    "live" | "editor" | "script" | "runtime"
>("live")

getWorldPlay((val) => (worldPlayPtr[0] = val))
