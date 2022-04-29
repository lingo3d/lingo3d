import { deg2Rad } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { Reactive } from "@lincode/reactivity"
import { debounce } from "@lincode/utils"
import { Quaternion } from "three"
import ICharacterCamera, { characterCameraDefaults, characterCameraSchema, LockTargetRotationValue } from "../../interface/ICharacterCamera"
import Camera from "../cameras/Camera"
import { euler, quaternion, quaternion_ } from "../utils/reusables"
import ObjectManager from "./ObjectManager"
import SimpleObjectManager from "./SimpleObjectManager"

export default class CharacterCamera extends Camera implements ICharacterCamera {
    public static override defaults = characterCameraDefaults
    public static override schema = characterCameraSchema

    public constructor() {
        super()
        this.createEffect(() => {
            const target = this.targetState.get()
            if (!target) return

            target.frustumCulled = false

            const followTarget = () => {
                euler.setFromQuaternion(target.outerObject3d.quaternion)
                euler.y += Math.PI
                this.outerObject3d.quaternion.setFromEuler(euler)
            }
            this.queueMicrotask(followTarget)
            this.updatePolarAngle()

            const handle = this.loop(() => {
                this.outerObject3d.position.copy(target.outerObject3d.position)
                if (!this.lockTargetRotation) return

                if (this.lockTargetRotation === "follow") {
                    followTarget()
                    this.gyrate(0, 0)
                    return
                }

                euler.setFromQuaternion(this.outerObject3d.quaternion)
                euler.x = 0
                euler.z = 0
                euler.y += Math.PI

                target.outerObject3d.quaternion.setFromEuler(euler)
            })

            return () => {
                handle.cancel()
            }
        }, [this.targetState.get])
    }

    public lockTargetRotation: LockTargetRotationValue = true

    protected targetState = new Reactive<SimpleObjectManager | undefined>(undefined)
    public get target() {
        return this.targetState.get()
    }
    public set target(target: SimpleObjectManager | undefined) {
        this.targetState.set(target)
    }

    private setTarget = debounce(() => {
        let i = 0
        for (const child of [this.target?.outerObject3d, ...this.camera.children]) {
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