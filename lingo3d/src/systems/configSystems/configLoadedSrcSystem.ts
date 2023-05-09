import { setManager, unsetManager } from "../../api/utils/getManager"
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
            setManager(loadedObject3d, self)
        })
        return () => {
            done = true
            self.$loadedGroup.clear()
            if (!self.$loadedObject3d) return
            unsetManager(self.$loadedObject3d)
            self.$loadedObject3d = undefined
        }
    })
