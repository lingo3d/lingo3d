import { Cancellable } from "@lincode/promiselikes"
import { Vector3 } from "three"
import PhysicsItem from "."
import scene from "../../../../engine/scene"
import getActualScale from "../../../utils/getActualScale"
import { bvhCharacterSet } from "./bvh/bvhLoop"

export default function (this: PhysicsItem, handle: Cancellable) {
    if (handle.done) return
    
    scene.attach(this.outerObject3d)
    
    //@ts-ignore
    this.width = this.depth = Math.min(this.width, this.depth)

    this.physicsUpdate = {}
    const actualScale = getActualScale(this).multiplyScalar(0.5)
    this.bvhHalfHeight = Math.max(actualScale.y, 0.5)
    this.bvhRadius = Math.max(actualScale.x, 0.5)

    this.bvhVelocity = new Vector3()
    bvhCharacterSet.add(this)
    handle.then(() => {
        bvhCharacterSet.delete(this)
        this.physicsUpdate = undefined
    })
}