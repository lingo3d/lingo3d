import Model from "../../display/Model"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import {
    addOutline,
    deleteOutline
} from "../../engine/renderLoop/effectComposer/outlineEffect"
import configLoadedSystemWithCleanUp2 from "../utils/configLoadedSystemWithCleanUp2"

export const [addConfigOutlineSystem] = configLoadedSystemWithCleanUp2(
    (self: Model | VisibleMixin) => {
        if (!self.outline) return false
        if ("findAllMeshes" in self) {
            const children = self.findAllMeshes()
            for (const child of children) addOutline(child.object3d)
        } else addOutline(self.object3d)
    },
    (self) => {
        if ("findAllMeshes" in self) {
            for (const child of self.findAllMeshes())
                deleteOutline(child.object3d)
        } else deleteOutline(self.object3d)
    }
)
