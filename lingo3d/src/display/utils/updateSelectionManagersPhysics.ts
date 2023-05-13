import { TransformControlsPayload } from "../../events/onTransformControls"
import { addConfigPhysicsSystem } from "../../systems/configLoadedSystems/configPhysicsSystem"
import getAllSelectionTargets from "../../throttle/getAllSelectionTargets"

export default ({ phase, mode }: TransformControlsPayload) => {
    if (phase !== "end") return
    if (mode === "scale") {
        for (const target of getAllSelectionTargets()) {
            if (!("object3d" in target)) continue
            target.userData.physicsMode = undefined
            addConfigPhysicsSystem(target)
        }
        return
    }
    for (const target of getAllSelectionTargets())
        "object3d" in target && addConfigPhysicsSystem(target)
}
