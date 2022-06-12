import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { last } from "@lincode/utils"
import { Bone as ThreeBone } from "three"
import { getRetargetBones, setRetargetBones } from "../../states/useRetargetBones"
import Bone from "../../display/Bone"
import { vector3, vector3_ } from "../../display/utils/reusables"
import { vec2Point } from "../../display/utils/vec2Point"

export default {}

createEffect(() => {
    const dummy = getRetargetBones()
    if (!dummy) return
    
    const handle = new Cancellable()
    
    handle.watch(dummy.loaded.then(loadedGroup => {
        const bones: Array<Bone> = []

        loadedGroup.traverse(object3d => {
            if (!(object3d instanceof ThreeBone)) return
    
            const child = last(object3d.children)
            if (!child) return
    
            const from = object3d.getWorldPosition(vector3)
            const to = child.getWorldPosition(vector3_)
    
            const bone = new Bone(object3d)
            bone.from = vec2Point(from)
            bone.to = vec2Point(to)
            
            bones.push(bone)
        })
        for (const bone of bones) {
            console.log(bone.target.name = "mixamorig" + bone.target.name)
        }
        setRetargetBones(undefined)
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