import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import renderSystemAutoClearWithCleanUp from "../utils/renderSystemAutoClearWithCleanUp"

export const [addRefreshPhysicsSystem] = renderSystemAutoClearWithCleanUp(
    (self: PhysicsObjectManager) => {}
)
