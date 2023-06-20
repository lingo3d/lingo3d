import store, { createEffect } from "@lincode/reactivity"
import { disposeStateSystem } from "../systems/eventSystems/disposeStateSystem"
import Script from "../display/Script"

export const [setScript, getScript] = store<Script | undefined>(undefined)

createEffect(() => {
    const script = getScript()
    if (!script) return
    disposeStateSystem.add(script, { setState: setScript })
    return () => {
        disposeStateSystem.delete(script)
    }
}, [getScript])
