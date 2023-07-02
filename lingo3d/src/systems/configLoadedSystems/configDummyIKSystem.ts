import { uuidMap } from "../../collections/idCollections"
import DummyIK from "../../display/DummyIK"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"

export const configDummyIKSystem = createLoadedEffectSystem(
    "configDummyIKSystem",
    {
        effect: (self: DummyIK) => {
            const { target, hips, spine0, spine1, spine2, neck } = self
            if (!target) return

            const dummy = uuidMap.get(target)
            console.log("loaded")
        },
        loading: (self) => {
            if (!self.target) return false
            const dummy = uuidMap.get(self.target)
            return (
                !!dummy && "$loadedObject3d" in dummy && !dummy.$loadedObject3d
            )
        }
    }
)
