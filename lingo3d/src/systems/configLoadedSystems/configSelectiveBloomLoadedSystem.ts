import Model from "../../display/Model"
import {
    addSelectiveBloom,
    deleteSelectiveBloom
} from "../../engine/renderLoop/effectComposer/selectiveBloomEffect"
import configLoadedSystemWithDispose from "../utils/configLoadedSystemWithDispose"

export const [addConfigSelectiveBloomLoadedSystem] =
    configLoadedSystemWithDispose(
        (self: Model) => {
            if (self.bloom)
                for (const child of self.findAllMeshes())
                    addSelectiveBloom(child.object3d)
            else
                for (const child of self.findAllMeshes())
                    deleteSelectiveBloom(child.object3d)

            return self.bloom
        },
        (self) => {
            for (const child of self.findAllMeshes())
                deleteSelectiveBloom(child.object3d)
        }
    )
