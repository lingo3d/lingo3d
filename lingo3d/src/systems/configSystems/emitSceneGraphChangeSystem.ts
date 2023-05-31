import Appendable from "../../display/core/Appendable"
import { emitSceneGraphChange } from "../../events/onSceneGraphChange"
import createInternalSystem from "../utils/createInternalSystem"

export const emitSceneGraphChangeSystem = createInternalSystem(
    "emitSceneGraphChangeSystem",
    {
        effect: (self: Appendable) =>
            !self.$disableSceneGraph && emitSceneGraphChange()
    }
)
