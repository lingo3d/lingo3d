import {
    addOutline,
    deleteOutline
} from "../../engine/renderLoop/effectComposer/outlineEffect"
import configLoadedSystemWithDispose from "../utils/configLoadedSystemWithDispose"

export const [addConfigOutlineSystem] = configLoadedSystemWithDispose(
    (self) => {
        const target =
            "loadedObject3d" in self ? self.loadedObject3d! : self.object3d
        self.bloom ? addOutline(target) : deleteOutline(target)
        return self.bloom
    },
    (self) => {
        deleteOutline(
            "loadedObject3d" in self ? self.loadedObject3d! : self.object3d
        )
    }
)
