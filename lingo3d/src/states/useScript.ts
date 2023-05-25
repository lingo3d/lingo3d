import store, { createEffect } from "@lincode/reactivity"
import {
    addDisposeStateSystem,
    deleteDisposeStateSystem
} from "../systems/eventSystems/disposeStateSystem"
import Script from "../display/Script"

export const [setScript, getScript] = store<Script | undefined>(undefined)

createEffect(() => {
    const script = getScript()
    if (!script) return
    addDisposeStateSystem(script, { setState: setScript })
    return () => {
        deleteDisposeStateSystem(script)
    }
}, [getScript])
