import {
    idRenderCheckMap,
    idRenderCheckModelMap
} from "../../collections/idCollections"
import Model from "../../display/Model"
import createInternalSystem from "../utils/createInternalSystem"

export const configRenderCheckModelSystem = createInternalSystem(
    "configRenderCheckModelSystem",
    {
        effect: (self: Model) => {
            for (const child of self.findAllMeshes()) {
                idRenderCheckMap.set(child.object3d.id, child)
                idRenderCheckModelMap.set(child.object3d.id, self)
            }
        },
        cleanup: (self) => {
            for (const child of self.findAllMeshes()) {
                idRenderCheckMap.delete(child.object3d.id)
                idRenderCheckModelMap.delete(child.object3d.id)
            }
        },
        disableRepeatAdd: true
    }
)
