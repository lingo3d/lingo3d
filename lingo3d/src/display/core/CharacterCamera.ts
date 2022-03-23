import { Cancellable } from "@lincode/promiselikes"
import ICharacterCamera from "../../interface/ICharacterCamera"
import Camera from "../cameras/Camera"
import { euler } from "../utils/reusables"
import Loaded from "./Loaded"
import ObjectManager from "./ObjectManager"

const uncull = (target: ObjectManager) => {
    target.outerObject3d.traverse(child => child.frustumCulled = false)
}

const setUncull = (target: ObjectManager) => {
    if (target instanceof Loaded)
            //@ts-ignore
            target.loadedResolvable.then(() => uncull(target))
        else
            uncull(target)
}

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
        if (target === this._target) return
        this._target = target

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

        setUncull(target)
    }

    public override append(object: ObjectManager) {
        if (this._target) {
            super.append(object)
            object.z = -100
            return
        }
        this.outerObject3d.parent?.add(object.outerObject3d)
        this.target = object

        setUncull(object)
    }
}