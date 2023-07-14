import Loaded from "../../display/core/Loaded"
import { setManager } from "../../display/core/utils/getManager"
import createInternalSystem from "../utils/createInternalSystem"

export const configLoadedSrcSystem = createInternalSystem(
    "configLoadedSrcSystem",
    {
        effect: (self: Loaded<any>) => {
            const { src } = self
            if (!src) return false

            self.$load(src).then((loaded) => {
                if (self.src !== src) return
                self.$loadedGroup.add(
                    (self.$loadedObject = setManager(
                        self.$resolveLoaded(loaded, src),
                        self
                    ))
                )
                self.$events.setState("loaded", self.$loadedObject)
                self.onLoad?.()
            })
        },
        cleanup: (self) => {
            self.$loadedGroup.clear()
            self.$loadedObject = undefined
            self.$events.deleteState("loaded")
        }
    }
)
