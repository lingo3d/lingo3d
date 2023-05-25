import { pull, push, store } from "@lincode/reactivity"
import { getScript } from "./useScript"
import Script from "../display/Script"

const [setScripts, getScripts] = store<Array<Script>>([])
export { getScripts }

const pushScripts = push(setScripts, getScripts)
export const pullScripts = pull(setScripts, getScripts)

getScript(
    (script) => script && !getScripts().includes(script) && pushScripts(script)
)
