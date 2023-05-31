import Appendable from "../../display/core/Appendable"
import { emitSceneGraphChange } from "../../events/onSceneGraphChange"
import createSystem from "../utils/createSystem"

export const emitSceneGraphChangeSystem = createSystem(
    "emitSceneGraphChangeSystem",
    {
        effect: (self: Appendable) =>
            !self.$disableSceneGraph && emitSceneGraphChange()
    }
)
