import { event } from "@lincode/events"

export const [emitEditorEdit, onEditorEdit] = event<{
    phase: "start" | "end"
    key: string
    value: any
}>()

onEditorEdit(({ phase, key, value }) => {
    if (key === "x" || key === "y" || key === "z") {
        // for (const target of getTransformTargets())
            // target.emitEvent("transformEdit", payload)
    }
})
