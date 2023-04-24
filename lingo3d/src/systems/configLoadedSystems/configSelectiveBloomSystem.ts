import {
    addSelectiveBloom,
    deleteSelectiveBloom
} from "../../engine/renderLoop/effectComposer/selectiveBloomEffect"
import configLoadedSystem from "../utils/configLoadedSystem"

export const [addConfigSelectiveBloomSystem] = configLoadedSystem((self) => {
    self.bloom
        ? addSelectiveBloom(self.object3d)
        : deleteSelectiveBloom(self.object3d)
})
