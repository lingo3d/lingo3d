import Model from "../../display/Model"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import {
    addOutline,
    deleteOutline
} from "../../engine/renderLoop/effectComposer/outlineEffect"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"

export const configOutlineSystem = createLoadedEffectSystem(
    "configOutlineSystem",
    {
        effect: (self: Model | VisibleMixin) => {
            if (!self.outline) return false
            if ("findAllMeshes" in self) {
                const children = self.findAllMeshes()
                for (const child of children) addOutline(child.$innerObject)
            } else addOutline(self.$innerObject)
        },
        cleanup: (self) => {
            if ("findAllMeshes" in self) {
                for (const child of self.findAllMeshes())
                    deleteOutline(child.$innerObject)
            } else deleteOutline(self.$innerObject)
        }
    }
)
