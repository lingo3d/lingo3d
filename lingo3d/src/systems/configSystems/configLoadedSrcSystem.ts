import Loaded from "../../display/core/Loaded"
import createSystem from "../utils/createInternalSystem"

export const configLoadedSrcSystem = createSystem("configLoadedSrcSystem", {
    effect: (self: Loaded<any>) => {
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
    cleanup: (self) => {
        self.$loadedGroup.clear()
        self.$loadedObject3d = undefined
        self.$events.deleteState("loaded")
    }
})
