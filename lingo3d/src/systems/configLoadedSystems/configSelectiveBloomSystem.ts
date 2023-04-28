import Model from "../../display/Model"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import {
    addSelectiveBloom,
    deleteSelectiveBloom
} from "../../engine/renderLoop/effectComposer/selectiveBloomEffect"
import configLoadedSystemWithCleanUp from "../utils/configLoadedSystemWithCleanUp"

export const [addConfigSelectiveBloomSystem, deleteConfigSelectiveBloomSystem] =
    configLoadedSystemWithCleanUp((self: Model | VisibleMixin) => {
        if (!self.outline) return
        if ("findAllMeshes" in self) {
            const children = self.findAllMeshes()
            for (const child of children) addSelectiveBloom(child.object3d)
            return () => {
                for (const child of children)
                    deleteSelectiveBloom(child.object3d)
            }
        }
        addSelectiveBloom(self.object3d)
        return () => {
            deleteSelectiveBloom(self.object3d)
        }
    })
