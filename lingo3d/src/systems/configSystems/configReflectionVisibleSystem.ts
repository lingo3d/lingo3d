import { reflectionVisibleSet } from "../../collections/reflectionCollections"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import createInternalSystem from "../utils/createInternalSystem"

export const configReflectionVisibleSystem = createInternalSystem(
    "configReflectionVisibleSystem",
    {
        effect: (self: VisibleMixin) => {
            if (!self.reflectionVisible) return false
            reflectionVisibleSet.add(self)
        },
        cleanup: (self) => {
            reflectionVisibleSet.delete(self)
        }
    }
)
