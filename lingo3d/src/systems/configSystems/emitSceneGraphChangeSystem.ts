import Appendable from "../../api/core/Appendable"
import { emitSceneGraphChange } from "../../events/onSceneGraphChange"
import diffSceneGraph from "../../throttle/diffSceneGraph"
import configSimpleSystem from "../utils/configSimpleSystem"

export const [addEmitSceneGraphChangeSystem, deleteEmitSceneGraphChangeSystem] =
    configSimpleSystem((self: Appendable) => {
        if (self.$disableSceneGraph) return
        emitSceneGraphChange(self)
        !self.$disableDiffSceneGraph && diffSceneGraph()
    })
