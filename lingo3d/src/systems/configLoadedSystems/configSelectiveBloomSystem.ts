import {
    addSelectiveBloom,
    deleteSelectiveBloom
} from "../../engine/renderLoop/effectComposer/selectiveBloomEffect"
import configLoadedSystemWithDispose from "../utils/configLoadedSystemWithDispose"

export const [addConfigSelectiveBloomSystem] = configLoadedSystemWithDispose(
    (self) => {
        const target =
            "loadedObject3d" in self
                ? self.loadedObject3d ?? self.object3d
                : self.object3d
        self.bloom ? addSelectiveBloom(target) : deleteSelectiveBloom(target)
        return self.bloom
    },
    (self) => {
        deleteSelectiveBloom(
            "loadedObject3d" in self
                ? self.loadedObject3d ?? self.object3d
                : self.object3d
        )
    }
)
