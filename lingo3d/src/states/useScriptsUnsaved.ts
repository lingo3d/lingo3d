import { add, remove, store } from "@lincode/reactivity"
import Script from "../display/Script"

const [setScriptsUnsaved, getScriptsUnsaved] = store([new Set<Script>()])
export { getScriptsUnsaved }

export const addScriptsUnsaved = add(setScriptsUnsaved, getScriptsUnsaved)
export const deleteScriptsUnsaved = remove(setScriptsUnsaved, getScriptsUnsaved)
