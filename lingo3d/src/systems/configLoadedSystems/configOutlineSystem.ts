import Model from "../../display/Model"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import {
    addOutline,
    deleteOutline
} from "../../engine/renderLoop/effectComposer/outlineEffect"
import configLoadedSystemWithDispose from "../utils/configLoadedSystemWithDispose"

export const [addConfigOutlineSystem] = configLoadedSystemWithDispose(
    (self: Model | VisibleMixin) => {
        if ("findAllMeshes" in self) {
            if (self.outline)
                for (const child of self.findAllMeshes())
                    addOutline(child.object3d)
            else
                for (const child of self.findAllMeshes())
                    deleteOutline(child.object3d)
        } else {
            if (self.outline) addOutline(self.object3d)
            else deleteOutline(self.object3d)
        }
        return self.outline
    },
    (self) => {
        if ("findAllMeshes" in self)
            for (const child of self.findAllMeshes())
                deleteOutline(child.object3d)
        else deleteOutline(self.object3d)
    }
)
