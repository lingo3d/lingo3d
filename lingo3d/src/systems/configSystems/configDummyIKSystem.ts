import { uuidMap } from "../../collections/uuidCollections"
import DummyIK from "../../display/DummyIK"
import Model from "../../display/Model"
import configSystem from "../utils/configSystem"

export const [addConfigDummyIKSystem] = configSystem((self: DummyIK) => {
    const { target, hips, spine0 } = self
    if (!target) return

    const dummy = uuidMap.get(target)
    if (!(dummy instanceof Model)) return
    if (!dummy.loadedObject3d) {
        dummy.loaded.then
        return
    }

    // const hipsMesh =
})
