import Appendable from "../../api/core/Appendable"
import { emitSceneGraphChange } from "../../events/onSceneGraphChange"
import configSimpleSystem from "../utils/configSimpleSystem"

export const [addEmitSceneGraphChangeSystem, deleteEmitSceneGraphChangeSystem] =
    configSimpleSystem(
        (self: Appendable) =>
            !self.disableSceneGraphChange && emitSceneGraphChange(self)
    )
