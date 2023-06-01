import store from "@lincode/reactivity"
import { USE_RUNTIME } from "../globals"
import { setEditorRuntime } from "./useEditorRuntime"

export const [setWorldPlay, getWorldPlay] = store<boolean | "script">(true)

getWorldPlay((val) => setEditorRuntime(USE_RUNTIME && !!val))
