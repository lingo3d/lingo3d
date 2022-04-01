import { deg2Rad } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { debounce } from "@lincode/utils"
import { Quaternion } from "three"
import ICharacterCamera from "../../interface/ICharacterCamera"
import Camera from "../cameras/Camera"
import { euler, quaternion, quaternion_ } from "../utils/reusables"
import ObjectManager from "./ObjectManager"

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

        this.queueMicrotask(() => this.outerObject3d.quaternion.copy(target.outerObject3d.quaternion))

        this.targetHandle = this.loop(() => {
            this.outerObject3d.position.copy(target.outerObject3d.position)

            euler.setFromQuaternion(this.outerObject3d.quaternion)
            euler.x = 0
            euler.z = 0
            euler.y += Math.PI

            target.outerObject3d.quaternion.setFromEuler(euler)
        })

        target.frustumCulled = false
    }

    private setTarget = debounce(() => {
        let i = 0
        for (const child of [this._target?.outerObject3d, ...this.camera.children]) {
            const object = child?.userData.manager
            if (!object || object.done) continue

            if (++i === 1) {
                this.outerObject3d.parent?.add(object.outerObject3d)
                this.target = object        
            }
            else object.z = -100
        }
        i === 0 && (this.target = undefined)

    }, 0, "trailing")

    public override append(object: ObjectManager) {
        super.append(object)
        this.setTarget()
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

            const minusHalfAngle = -orient * 0.5
            screenTransform.set(0, Math.sin(minusHalfAngle), 0, Math.cos(minusHalfAngle))

            this.object3d.quaternion.multiply(screenTransform)
            this.object3d.quaternion.multiply(worldTransform)
        }
        window.addEventListener("deviceorientation", cb)
        this.gyroControlHandle = this.cancellable(() => window.removeEventListener("deviceorientation", cb))
    }
}