import { Cancellable } from "@lincode/promiselikes"
import { Vector3 } from "three"
import PhysicsItem from "."
import scene from "../../../../engine/scene"
import getActualScale from "../../../utils/getActualScale"
import { bvhCharacterSet } from "./bvh/bvhLoop"

const computeCoeff = (x: number) => 0.9227186 + (-2.234932 - 0.9227186)/(1 + (x/0.2678716)**1.417467)

export default function (this: PhysicsItem, handle: Cancellable) {
    if (handle.done) return
    
    scene.attach(this.outerObject3d)
    
    this.physicsUpdate = {}
    const actualScale = getActualScale(this).multiplyScalar(0.5)
    this.bvhHeight = Math.max(actualScale.y, 0.5)
    this.bvhRadius = Math.max(actualScale.x, actualScale.z, 0.5)
    this.bvhCoeff = computeCoeff(this.bvhHeight)
    if (this.bvhCoeff < 0.05) this.bvhCoeff = 0

    this.bvhVelocity = new Vector3()
    bvhCharacterSet.add(this)
    handle.then(() => {
        bvhCharacterSet.delete(this)
        this.physicsUpdate = undefined
    })
}