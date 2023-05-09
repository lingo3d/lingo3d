import { nativeIdMap } from "../collections/idCollections"
import Model from "../display/Model"
import VisibleMixin from "../display/core/mixins/VisibleMixin"
import computeOnce from "./utils/computeOnce"

export default computeOnce((target: VisibleMixin | Model) => {
    if ("findAllMeshes" in target) {
        for (const child of target.findAllMeshes())
            nativeIdMap.set(child.object3d.id, child)
        return
    }
    nativeIdMap.set(target.object3d.id, target)
})
