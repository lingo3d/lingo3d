import { Cancellable } from "@lincode/promiselikes"
import unsafeGetValue from "../utils/unsafeGetValue"
import createInternalSystem from "./utils/createInternalSystem"

const onInterval = (cb: () => void) => {
    const interval = setInterval(cb, 100)
    return new Cancellable(() => clearInterval(interval))
}

export const runtimeIframeScriptSystem = createInternalSystem(
    "runtimeIframeScriptSystem",
    {
        data: { script: "" },
        update: (self: HTMLIFrameElement, data) => {
            const $eval = unsafeGetValue(self, "$eval")
            if (!$eval) return
            $eval(data.script)
            runtimeIframeScriptSystem.delete(self)
        },
        updateTicker: onInterval
    }
)
