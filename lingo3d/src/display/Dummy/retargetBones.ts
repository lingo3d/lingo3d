import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { last } from "@lincode/utils"
import { Bone as ThreeBone } from "three"
import { getRetargetBones } from "../../states/useRetargetBones"
import Bone from "../Bone"
import { vector3, vector3_ } from "../utils/reusables"
import { vec2Point } from "../utils/vec2Point"

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
    
            const bone = new Bone()
            bone.from = vec2Point(from)
            bone.to = vec2Point(to)
            bone.name = object3d.name
            
            bones.push(bone)
        })
        handle.then(() => {
            for (const bone of bones)
                bone.dispose()
        })
    }))

    return () => {
        handle.cancel()
    }
}, [getRetargetBones])