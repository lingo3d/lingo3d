import MeshAppendable from "../../api/core/MeshAppendable"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { onAfterRender } from "../../events/onAfterRender"
import configSystem from "../utils/configSystem"

export const transformChangedSet = new Set<
    MeshAppendable | PhysicsObjectManager
>()

export const [addTransformChangedSystem] = configSystem(
    (self: MeshAppendable | PhysicsObjectManager) => {},
    onAfterRender,
    transformChangedSet
)
