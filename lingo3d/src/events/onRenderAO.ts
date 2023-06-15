import { event } from "@lincode/events"
import { excludeAOSet } from "../collections/excludeAOSet"

export const [emitRenderAO, onRenderAO] = event<"before" | "after">()

onRenderAO((phase) => {
    if (phase === "before") {
        for (const target of excludeAOSet) target.visible = false
        return
    }
    for (const target of excludeAOSet) target.visible = true
})
