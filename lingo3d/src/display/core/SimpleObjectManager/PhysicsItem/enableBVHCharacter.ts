import { Cancellable } from "@lincode/promiselikes"
import { Vector3 } from "three"
import PhysicsItem from "."
import getActualScale from "../../../utils/getActualScale"
import { bvhCharacterSet } from "./bvh/bvhLoop"

export default function (this: PhysicsItem, handle: Cancellable) {
    this.physicsUpdate = {}
    this.bvhRadius = getActualScale(this).y * 0.5
    this.bvhVelocity = new Vector3()
    bvhCharacterSet.add(this)
    handle.then(() => {
        bvhCharacterSet.delete(this)
        this.physicsUpdate = undefined
    })
}