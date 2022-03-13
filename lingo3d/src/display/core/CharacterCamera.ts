import { Cancellable } from "@lincode/promiselikes"
import ICharacterCamera from "../../interface/ICharacterCamera"
import Camera from "../cameras/Camera"
import { euler } from "../utils/reusables"
import ObjectManager from "./ObjectManager"

export default class CharacterCamera extends Camera implements ICharacterCamera {
    public constructor() {
        super()
    }

    private targetHandle: Cancellable | undefined
    protected _target: ObjectManager | undefined
    public get target() {
        return this._target
    }
    public set target(target: ObjectManager | undefined) {
        this.targetHandle?.cancel()
        
        if (!target) return

        this.targetHandle = this.loop(() => {
            this.outerObject3d.position.copy(target.outerObject3d.position)

            euler.setFromQuaternion(this.outerObject3d.quaternion)
            euler.x = 0
            euler.z = 0
            euler.y += Math.PI

            target.outerObject3d.quaternion.setFromEuler(euler)
        })
    }

    public override append(object: ObjectManager) {
        this.outerObject3d.parent?.add(object.outerObject3d)
        this.target = object
    }
}