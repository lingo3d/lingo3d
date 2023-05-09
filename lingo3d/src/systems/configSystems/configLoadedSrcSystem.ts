import Loaded from "../../display/core/Loaded"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"

export const [addConfigLoadedSrcSystem, deleteConfigLoadedSrcSystem] =
    configSystemWithCleanUp((self: Loaded<any>) => {
        const { src } = self
        if (!src) return

        let done = false
        self.$load(src).then((loaded) => {
            if (done) return
            const loadedObject3d = self.$resolveLoaded(loaded, src)
            self.$loadedGroup.add((self.$loadedObject3d = loadedObject3d))
            self.events.setState("loaded", loadedObject3d)
        })
        return () => {
            done = true
            self.$loadedGroup.clear()
            self.$loadedObject3d = undefined
        }
    })
