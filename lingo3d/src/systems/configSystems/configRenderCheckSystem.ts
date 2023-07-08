import { idRenderCheckMap } from "../../collections/idCollections"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import createInternalSystem from "../utils/createInternalSystem"

export const configRenderCheckSystem = createInternalSystem(
    "configRenderCheckSystem",
    {
        effect: (self: VisibleMixin) => {
            idRenderCheckMap.set(self.$innerObject.id, self)
        },
        cleanup: (self) => {
            idRenderCheckMap.delete(self.$innerObject.id)
        },
        disableRepeatAdd: true
    }
)
