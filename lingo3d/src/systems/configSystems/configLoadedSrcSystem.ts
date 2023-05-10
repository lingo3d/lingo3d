import Loaded from "../../display/core/Loaded"
import configSystemWithCleanUp2 from "../utils/configSystemWithCleanUp2"

export const [addConfigLoadedSrcSystem, deleteConfigLoadedSrcSystem] =
    configSystemWithCleanUp2(
        (self: Loaded<any>) => {
            const { src } = self
            if (!src) return

            self.$load(src).then((loaded) => {
                if (self.src !== src) return
                const loadedObject3d = self.$resolveLoaded(loaded, src)
                self.$loadedGroup.add((self.$loadedObject3d = loadedObject3d))
                self.events.setState("loaded", loadedObject3d)
            })
        },
        (self) => {
            self.$loadedGroup.clear()
            self.$loadedObject3d = undefined
        }
    )
