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
                idRenderCheckMap.set(child.$innerObject.id, child)
                idRenderCheckModelMap.set(child.$innerObject.id, self)
            }
        },
        cleanup: (self) => {
            for (const child of self.findAllMeshes()) {
                idRenderCheckMap.delete(child.$innerObject.id)
                idRenderCheckModelMap.delete(child.$innerObject.id)
            }
        },
        disableRepeatAdd: true
    }
)
