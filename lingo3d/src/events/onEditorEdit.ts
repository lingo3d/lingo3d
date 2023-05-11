import { event } from "@lincode/events"
import getAllSelectionTargets from "../memo/getAllSelectionTargets"
import { TransformControlsPayload } from "./onTransformControls"
import updateSelectionManagersPhysics from "../display/utils/updateSelectionManagersPhysics"

export const [emitEditorEdit, onEditorEdit] = event<{
    phase: "start" | "end"
    key: string
    value: any
}>()

onEditorEdit(({ phase, key }) => {
    let payload: TransformControlsPayload | undefined
    if (key === "x" || key === "y" || key === "z")
        payload = { phase, mode: "translate" }
    else if (key.startsWith("rotation")) payload = { phase, mode: "rotate" }
    else if (key.startsWith("scale")) payload = { phase, mode: "scale" }

    if (!payload) return
    for (const target of getAllSelectionTargets())
        target.emitEvent("transformEdit", payload)

    updateSelectionManagersPhysics(payload)
})
