import unsafeGetValue from "../utils/unsafeGetValue"
import renderSystemWithData from "./utils/renderSystemWithData"

export const [addRuntimeIframeScriptSystem, deleteRuntimeIframeScriptSystem] =
    renderSystemWithData(
        (self: HTMLIFrameElement, data: { script: string }) => {
            const $eval = unsafeGetValue(self, "$eval")
            if (!$eval) return
            $eval(data.script)
            deleteRuntimeIframeScriptSystem(self)
        }
    )
