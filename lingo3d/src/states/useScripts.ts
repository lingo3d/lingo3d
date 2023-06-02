import { add, createEffect, remove, store } from "@lincode/reactivity"
import { getScript } from "./useScript"
import Script from "../display/Script"
import { extendFunction } from "@lincode/utils"
import { deleteScriptsUnsaved } from "./useScriptsUnsaved"
import {
    addDisposeCollectionStateSystem,
    deleteDisposeCollectionStateSystem
} from "../systems/eventSystems/disposeCollectionStateSystem"

const scriptSet = new Set<Script>()

const [setScripts, getScripts] = store([scriptSet])
export { getScripts }

export const deleteScripts = extendFunction(
    remove(setScripts, getScripts),
    deleteScriptsUnsaved
)

const addScripts = add(setScripts, getScripts)
getScript((script) => script && !scriptSet.has(script) && addScripts(script))

createEffect(() => {
    if (!scriptSet.size) return
    addDisposeCollectionStateSystem(scriptSet, {
        deleteState: deleteScripts
    })
    return () => {
        deleteDisposeCollectionStateSystem(scriptSet)
    }
}, [getScripts])
