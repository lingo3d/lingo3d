import { event } from "@lincode/events"
import { ssaoExcludeSet } from "../collections/ssaoExcludeSet"

export const [emitRenderSSAO, onRenderSSAO] = event<"before" | "after">()

onRenderSSAO((phase) => {
    if (phase === "before") {
        for (const target of ssaoExcludeSet) target.visible = false
        return
    }
    for (const target of ssaoExcludeSet) target.visible = true
})
