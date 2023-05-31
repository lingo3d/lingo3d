import { Cancellable } from "@lincode/promiselikes"
import unsafeGetValue from "../utils/unsafeGetValue"
import createSystem from "./utils/createSystem"

const onInterval = (cb: () => void) => {
    const interval = setInterval(cb, 100)
    return new Cancellable(() => clearInterval(interval))
}

export const runtimeIframeScriptSystem = createSystem(
    "runtimeIframeScriptSystem",
    {
        data: { script: "" },
        update: (self: HTMLIFrameElement, data) => {
            const $eval = unsafeGetValue(self, "$eval")
            if (!$eval) return
            $eval(data.script)
            runtimeIframeScriptSystem.delete(self)
        },
        ticker: onInterval
    }
)
