import { Cancellable } from "@lincode/promiselikes"
import unsafeGetValue from "../utils/unsafeGetValue"
import renderSystemWithData from "./utils/renderSystemWithData"

const onInterval = (cb: () => void) => {
    const interval = setInterval(cb, 100)
    return new Cancellable(() => clearInterval(interval))
}

export const [addRuntimeIframeScriptSystem, deleteRuntimeIframeScriptSystem] =
    renderSystemWithData(
        (self: HTMLIFrameElement, data: { script: string }) => {
            const $eval = unsafeGetValue(self, "$eval")
            if (!$eval) return
            $eval(data.script)
            deleteRuntimeIframeScriptSystem(self)
        },
        onInterval
    )
