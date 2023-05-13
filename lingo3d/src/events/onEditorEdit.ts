import { event } from "@lincode/events"
import { TransformControlsPayload } from "./onTransformControls"
import updateSelectionManagersPhysics from "../display/utils/updateSelectionManagersPhysics"
import diffSceneGraph from "../throttle/diffSceneGraph"
import getAllSelectionTargets from "../throttle/getAllSelectionTargets"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"

export const [emitEditorEdit, onEditorEdit] = event<{
    phase: "start" | "end"
    key: string
    value: any
}>()

onEditorEdit(({ phase, key }) => {
    phase === "end" &&
        !selectionTargetPtr[0]?.$disableSerialize &&
        diffSceneGraph()

    let payload: TransformControlsPayload | undefined
    if (key === "x" || key === "y" || key === "z")
        payload = { phase, mode: "translate" }
    else if (key.startsWith("rotation")) payload = { phase, mode: "rotate" }
    else if (key.startsWith("scale")) payload = { phase, mode: "scale" }

    if (!payload) return
    for (const target of getAllSelectionTargets())
        target.$emitEvent("transformEdit", payload)

    updateSelectionManagersPhysics(payload)
})
