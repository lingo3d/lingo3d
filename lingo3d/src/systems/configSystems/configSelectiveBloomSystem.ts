import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import {
    addSelectiveBloom,
    deleteSelectiveBloom
} from "../../engine/renderLoop/effectComposer/selectiveBloomEffect"
import configSystemWithDispose from "../utils/configSystemWithDispose"

export const [addConfigSelectiveBloomSystem] = configSystemWithDispose(
    (self: VisibleMixin) => {
        self.bloom
            ? addSelectiveBloom(self.object3d)
            : deleteSelectiveBloom(self.object3d)
        return self.bloom
    },
    (self) => deleteSelectiveBloom(self.object3d)
)
