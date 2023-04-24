import Model from "../../display/Model"
import {
    addOutline,
    deleteOutline
} from "../../engine/renderLoop/effectComposer/outlineEffect"
import configLoadedSystemWithDispose from "../utils/configLoadedSystemWithDispose"

export const [addConfigOutlineLoadedSystem] = configLoadedSystemWithDispose(
    (self: Model) => {
        if (self.outline)
            for (const child of self.findAllMeshes()) addOutline(child.object3d)
        else
            for (const child of self.findAllMeshes())
                deleteOutline(child.object3d)

        return self.outline
    },
    (self) => {
        for (const child of self.findAllMeshes()) deleteOutline(child.object3d)
    }
)
