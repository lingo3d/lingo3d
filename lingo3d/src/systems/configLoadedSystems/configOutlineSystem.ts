import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import {
    addOutline,
    deleteOutline
} from "../../engine/renderLoop/effectComposer/outlineEffect"
import configSystemWithDispose from "../utils/configSystemWithDispose"

export const [addConfigOutlineSystem] = configSystemWithDispose(
    (self: VisibleMixin) => {
        self.outline ? addOutline(self.object3d) : deleteOutline(self.object3d)
        return self.outline
    },
    (self) => deleteOutline(self.object3d)
)
