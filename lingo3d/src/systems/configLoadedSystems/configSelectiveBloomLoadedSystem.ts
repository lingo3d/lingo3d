import Model from "../../display/Model"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import {
    addSelectiveBloom,
    deleteSelectiveBloom
} from "../../engine/renderLoop/effectComposer/selectiveBloomEffect"
import configLoadedSystemWithDispose from "../utils/configLoadedSystemWithDispose"

export const [addConfigSelectiveBloomLoadedSystem] =
    configLoadedSystemWithDispose(
        (self: Model | VisibleMixin) => {
            if ("findAllMeshes" in self) {
                if (self.bloom)
                    for (const child of self.findAllMeshes())
                        addSelectiveBloom(child.object3d)
                else
                    for (const child of self.findAllMeshes())
                        deleteSelectiveBloom(child.object3d)
            } else {
                if (self.bloom) addSelectiveBloom(self.object3d)
                else deleteSelectiveBloom(self.object3d)
            }
            return self.bloom
        },
        (self) => {
            if ("findAllMeshes" in self)
                for (const child of self.findAllMeshes())
                    deleteSelectiveBloom(child.object3d)
            else deleteSelectiveBloom(self.object3d)
        }
    )
