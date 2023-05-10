import Model from "../../display/Model"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import {
    addSelectiveBloom,
    deleteSelectiveBloom
} from "../../engine/renderLoop/effectComposer/selectiveBloomEffect"
import configLoadedSystemWithCleanUp2 from "../utils/configLoadedSystemWithCleanUp2"

export const [addConfigSelectiveBloomSystem] = configLoadedSystemWithCleanUp2(
    (self: Model | VisibleMixin) => {
        if (!self.bloom) return
        if ("findAllMeshes" in self) {
            const children = self.findAllMeshes()
            for (const child of children) addSelectiveBloom(child.object3d)
            return () => {
                for (const child of children)
                    deleteSelectiveBloom(child.object3d)
            }
        }
        addSelectiveBloom(self.object3d)
    },
    (self) => deleteSelectiveBloom(self.object3d)
)
