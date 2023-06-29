import store, { add, remove } from "@lincode/reactivity"
import Script from "../display/Script"

export const scriptCompilingSet = new Set<Script>()
const [setScriptCompiling, getScriptCompiling] = store([scriptCompilingSet])
export { getScriptCompiling }

export const addScriptCompiling = add(setScriptCompiling, getScriptCompiling)
export const deleteScriptCompiling = remove(
    setScriptCompiling,
    getScriptCompiling
)
