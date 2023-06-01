import store from "@lincode/reactivity"
import { USE_RUNTIME } from "../globals"
import { setEditorRuntime } from "./useEditorRuntime"
import { getScript } from "./useScript"
import { setScriptCompile } from "./useScriptCompile"

export const [setWorldPlay, getWorldPlay] = store<boolean | "script">(true)

getWorldPlay((val) => {
    setEditorRuntime(USE_RUNTIME && !!val)
    if (val !== "script") return
    const script = getScript()
    script && setScriptCompile({ raw: script.code })
})
