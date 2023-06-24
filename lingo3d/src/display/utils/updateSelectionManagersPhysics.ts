import { TransformControlsPayload } from "../../events/onTransformControls"
import { configPhysicsShapeSystem } from "../../systems/configSystems/configPhysicsShapeSystem"
import { configPhysicsTransformSystem } from "../../systems/configSystems/configPhysicsTransformSystem"
import getAllSelectionTargets from "../../throttle/getAllSelectionTargets"
import PhysicsObjectManager from "../core/PhysicsObjectManager"

export default ({ phase, mode }: TransformControlsPayload) => {
    if (phase !== "end") return
    if (mode === "scale") {
        for (const target of getAllSelectionTargets())
            target instanceof PhysicsObjectManager &&
                configPhysicsShapeSystem.add(target)
        return
    }
    for (const target of getAllSelectionTargets())
        target instanceof PhysicsObjectManager &&
            configPhysicsTransformSystem.add(target)
}
