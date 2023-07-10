import Loaded from "../../display/core/Loaded"
import { busyCountPtr } from "../../pointers/busyCountPtr"
import createInternalSystem from "../utils/createInternalSystem"

export const configLoadedSrcSystem = createInternalSystem(
    "configLoadedSrcSystem",
    {
        effect: (self: Loaded<any>) => {
            const { src } = self
            if (!src) return false

            busyCountPtr[0]++
            self.$load(src).then((loaded) => {
                if (self.src !== src) {
                    busyCountPtr[0]--
                    return
                }
                self.$loadedGroup.add(
                    (self.$loadedObject = self.$resolveLoaded(loaded, src))
                )
                self.$events.setState("loaded", self.$loadedObject)
                self.onLoad?.()
                busyCountPtr[0]--
            })
        },
        cleanup: (self) => {
            self.$loadedGroup.clear()
            self.$loadedObject = undefined
            self.$events.deleteState("loaded")
        }
    }
)
