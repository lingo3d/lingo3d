import { deg2Rad } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { Quaternion } from "three"
import ICharacterCamera from "../../interface/ICharacterCamera"
import Camera from "../cameras/Camera"
import { euler, quaternion, quaternion_ } from "../utils/reusables"
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
    
    private gyroControlHandle?: Cancellable
    private _gyroControl?: boolean
    public get gyroControl() {
        return !!this._gyroControl
    }
    public set gyroControl(val: boolean) {
        if (this._gyroControl === val) return
        this._gyroControl

        this.gyroControlHandle?.cancel()

        const deviceEuler = euler
        const deviceQuaternion = quaternion
        const screenTransform = quaternion_
        const worldTransform = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5))

        const quat = this.object3d.getWorldQuaternion(quaternion).clone()
        const orient = 0

        const cb = (e: DeviceOrientationEvent) => {
            this.object3d.quaternion.copy(quat)
            deviceEuler.set((e.beta ?? 0) * deg2Rad, (e.alpha ?? 0) * deg2Rad, -(e.gamma ?? 0) * deg2Rad, "YXZ")

            this.object3d.quaternion.multiply(deviceQuaternion.setFromEuler(deviceEuler))

            const minusHalfAngle = -orient / 2
            screenTransform.set(0, Math.sin(minusHalfAngle), 0, Math.cos(minusHalfAngle))

            this.object3d.quaternion.multiply(screenTransform)
            this.object3d.quaternion.multiply(worldTransform)
        }
        window.addEventListener("deviceorientation", cb)
        this.gyroControlHandle = this.cancellable(() => window.removeEventListener("deviceorientation", cb))
    }
}