import { pull, push, store } from "@lincode/reactivity"
import { getScript } from "./useScript"
import Script from "../display/Script"
import { extendFunction } from "@lincode/utils"
import { deleteScriptsUnsaved } from "./useScriptsUnsaved"

const [setScripts, getScripts] = store<Array<Script>>([])
export { getScripts }

export const pullScripts = extendFunction(
    pull(setScripts, getScripts),
    deleteScriptsUnsaved
)

const pushScripts = push(setScripts, getScripts)
getScript(
    (script) => script && !getScripts().includes(script) && pushScripts(script)
)
