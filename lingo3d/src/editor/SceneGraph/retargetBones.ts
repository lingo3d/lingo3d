import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { Bone as ThreeBone, Object3D } from "three"
import { getRetargetBones } from "../../states/useRetargetBones"
import Bone from "../../display/Bone"

export default {}

createEffect(() => {
    const dummy = getRetargetBones()
    if (!dummy) return
    
    const handle = new Cancellable()
    
    handle.watch(dummy.loaded.then(loadedGroup => {
        const bones: Array<Bone> = []

        const bone = loadedGroup.getObjectByProperty("type", "Bone") as ThreeBone

        const traverse = (parent: Object3D) => {
            parent.name = "mixamorig" + parent.name

            for (const child of parent.children) {
                const bone = new Bone(parent, child)
                bones.push(bone)

                traverse(child)
            }
        }
        traverse(bone)
        dummy.mixamo = true

        handle.then(() => {
            for (const bone of bones)
                bone.dispose()
        })
    }))

    return () => {
        handle.cancel()
    }
}, [getRetargetBones])