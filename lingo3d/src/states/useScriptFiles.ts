import { store } from "@lincode/reactivity"
import { getScript } from "./useScript"

export const [setScriptFiles, getScriptFiles] = store<[Record<string, string>]>(
    [{}]
)

getScript((script) => {
    if (!script) return
    const [scriptFiles] = getScriptFiles()
    scriptFiles[script.uuid] = script.code
    setScriptFiles([scriptFiles])
})
