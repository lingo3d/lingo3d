import Model from "../../display/Model"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import {
    addSelectiveBloom,
    deleteSelectiveBloom
} from "../../engine/renderLoop/effectComposer/selectiveBloomEffect"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"

export const configSelectiveBloomSystem = createLoadedEffectSystem(
    "configSelectiveBloomSystem",
    {
        effect: (self: Model | VisibleMixin) => {
            if (!self.bloom) return false
            if ("findAllMeshes" in self) {
                const children = self.findAllMeshes()
                for (const child of children) addSelectiveBloom(child.$innerObject)
            } else addSelectiveBloom(self.$innerObject)
        },
        cleanup: (self) => {
            if ("findAllMeshes" in self) {
                for (const child of self.findAllMeshes())
                    deleteSelectiveBloom(child.$innerObject)
            } else deleteSelectiveBloom(self.$innerObject)
        }
    }
)
