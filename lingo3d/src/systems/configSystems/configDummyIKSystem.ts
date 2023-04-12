import { Bone } from "three"
import { uuidMap } from "../../collections/uuidCollections"
import DummyIK from "../../display/DummyIK"
import Model from "../../display/Model"
import { getSkeleton } from "../../utilsCached/getSkeleton"
import { indexChilrenNames } from "../../utilsCached/indexChildrenNames"
import configSystem from "../utils/configSystem"
import { getBoneIndexMap } from "../../utilsCached/getBoneIndexMap"
import { CCDIKSolver } from "three/examples/jsm/animation/CCDIKSolver"
import { onBeforeRender } from "../../events/onBeforeRender"
import scene from "../../engine/scene"

export const [addConfigDummyIKSystem] = configSystem((self: DummyIK) => {
    const { target, hips, spine0, spine1, spine2, neck } = self
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

    if (hips && spine0 && spine1 && spine2 && neck) {
        const hipsBone = nameChildMap.get(hips) as Bone
        const spine0Bone = nameChildMap.get(spine0) as Bone
        const spine1Bone = nameChildMap.get(spine1) as Bone
        const spine2Bone = nameChildMap.get(spine2) as Bone
        const neckBone = nameChildMap.get(neck) as Bone

        const hipsIndex = boneIndexMap.get(hipsBone)
        const spine0Index = boneIndexMap.get(spine0Bone)
        const spine1Index = boneIndexMap.get(spine1Bone)
        const spine2Index = boneIndexMap.get(spine2Bone)
        const neckIndex = boneIndexMap.get(neckBone)

        if (
            hipsIndex !== undefined &&
            spine0Index !== undefined &&
            spine1Index !== undefined &&
            spine2Index !== undefined &&
            neckIndex !== undefined
        ) {
            // const ikSolver = new CCDIKSolver({ skeleton } as any, [
            //     {
            //         target: neckIndex,
            //         effector: spine2Index,
            //         links: [
            //             { index: spine1Index },
            //             { index: spine0Index },
            //             { index: hipsIndex }
            //         ]
            //     } as any
            // ])
            // onBeforeRender(() => {
            //     ikSolver.update()
            // })
        }
    }
})
