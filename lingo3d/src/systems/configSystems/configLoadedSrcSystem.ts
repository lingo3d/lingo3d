import Loaded from "../../display/core/Loaded"
import configSystemWithCleanUp2 from "../utils/configSystemWithCleanUp2"

export const [addConfigLoadedSrcSystem, deleteConfigLoadedSrcSystem] =
    configSystemWithCleanUp2(
        (self: Loaded<any>) => {
            const { src } = self
            if (!src) return false

            self.$load(src).then((loaded) => {
                if (self.src !== src) return
                self.$loadedGroup.add(
                    (self.$loadedObject3d = self.$resolveLoaded(loaded, src))
                )
                self.$events.setState("loaded", self.$loadedObject3d)
            })
        },
        (self) => {
            self.$loadedGroup.clear()
            self.$loadedObject3d = undefined
            self.$events.deleteState("loaded")
        }
    )
