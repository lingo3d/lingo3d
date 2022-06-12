import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { Bone as ThreeBone } from "three"
import { getRetargetBones } from "../../states/useRetargetBones"
import Bone from "../../display/Bone"

export default {}

createEffect(() => {
    const dummy = getRetargetBones()
    if (!dummy) return
    
    const handle = new Cancellable()
    
    handle.watch(dummy.loaded.then(loadedGroup => {
        const bones: Array<Bone> = []

        loadedGroup.traverse(object3d => {
            if (!(object3d instanceof ThreeBone)) return
            const bone = new Bone(object3d)
            bone.target.name = "mixamorig" + bone.target.name
            bones.push(bone)
        })
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