import { Bone } from "three"
import { uuidMap } from "../../collections/uuidCollections"
import DummyIK from "../../display/DummyIK"
import Model from "../../display/Model"
import { getSkeleton } from "../../utilsCached/getSkeleton"
import { indexChilrenNames } from "../../utilsCached/indexChildrenNames"
import configSystem from "../utils/configSystem"
import { getBoneIndexMap } from "../../utilsCached/getBoneIndexMap"

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

    const skeleton = getSkeleton(dummy.loadedObject3d)
    if (!skeleton) return

    const nameChildMap = indexChilrenNames(dummy.loadedObject3d)
    const boneIndexMap = getBoneIndexMap(skeleton)

    if (hips && spine0) {
        const hipsBone = nameChildMap.get(hips) as Bone
        const spine0Bone = nameChildMap.get(spine0) as Bone

        console.log(boneIndexMap.get(hipsBone), boneIndexMap.get(spine0Bone))
    }
})
