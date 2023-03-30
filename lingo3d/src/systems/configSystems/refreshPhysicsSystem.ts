import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"

export const [addRefreshPhysicsSystem] = configSystemWithCleanUp(
    (self: PhysicsObjectManager) => {}
)
