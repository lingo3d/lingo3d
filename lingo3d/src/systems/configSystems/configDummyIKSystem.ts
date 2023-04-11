import { uuidMap } from "../../collections/uuidCollections"
import DummyIK from "../../display/DummyIK"
import Model from "../../display/Model"
import { indexChilrenNames } from "../../utilsCached/indexChildrenNames"
import configSystem from "../utils/configSystem"

export const [addConfigDummyIKSystem] = configSystem((self: DummyIK) => {
    const { target, hips, spine0 } = self
    if (!target) return

    const dummy = uuidMap.get(target)
    if (!(dummy instanceof Model)) return
    if (!dummy.loadedObject3d) {
        const handle = dummy.loaded.then(() => {
            handle.cancel()
            addConfigDummyIKSystem(self)
        })
        return
    }

    const nameMeshMap = indexChilrenNames(dummy.loadedObject3d)

    if (hips && spine0) {
        const hipsMesh = nameMeshMap.get(hips)
        const spine0Mesh = nameMeshMap.get(spine0)

        if (hips && spine0) {
            console.log("here")
            console.log(hipsMesh, spine0Mesh)
        }
    }
})
