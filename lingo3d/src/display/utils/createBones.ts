import Model from "../Model"
import { Bone as ThreeBone } from "three"
import { last } from "@lincode/utils"
import { vector3, vector3_ } from "./reusables"
import { vec2Point } from "./vec2Point"
import Bone from "../Bone"
import { Cancellable } from "@lincode/promiselikes"

export default (bot: Model) => {
    const handle = new Cancellable()
    
    handle.watch(bot.loaded.then(loadedGroup => {
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
    return handle
}