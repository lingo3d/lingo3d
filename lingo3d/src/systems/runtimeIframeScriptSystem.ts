import unsafeGetValue from "../utils/unsafeGetValue"
import createInternalSystem from "./utils/createInternalSystem"

export const runtimeIframeScriptSystem = createInternalSystem(
    "runtimeIframeScriptSystem",
    {
        data: { script: "" },
        update: (self: HTMLIFrameElement, data) => {
            const $eval = unsafeGetValue(self, "$eval")
            if (!$eval) return
            $eval(data.script)
            runtimeIframeScriptSystem.delete(self)
        }
    }
)
