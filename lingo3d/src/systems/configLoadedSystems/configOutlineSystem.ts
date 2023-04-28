import Model from "../../display/Model"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import {
    addOutline,
    deleteOutline
} from "../../engine/renderLoop/effectComposer/outlineEffect"
import configLoadedSystemWithCleanUp from "../utils/configLoadedSystemWithCleanUp"

export const [addConfigOutlineSystem, deleteConfigOutlineSystem] =
    configLoadedSystemWithCleanUp((self: Model | VisibleMixin) => {
        if (!self.outline) return
        if ("findAllMeshes" in self) {
            const children = self.findAllMeshes()
            for (const child of children) addOutline(child.object3d)
            return () => {
                for (const child of children) deleteOutline(child.object3d)
            }
        }
        addOutline(self.object3d)
        return () => {
            deleteOutline(self.object3d)
        }
    })
