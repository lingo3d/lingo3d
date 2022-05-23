import { deg2Rad } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { Reactive } from "@lincode/reactivity"
import { Quaternion } from "three"
import PositionedItem from "../../api/core/PositionedItem"
import { loop } from "../../engine/eventLoop"
import scene from "../../engine/scene"
import { onSceneChange } from "../../events/onSceneChange"
import ICharacterCamera, { characterCameraDefaults, characterCameraSchema, LockTargetRotationValue } from "../../interface/ICharacterCamera"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import { getTransformControlsMode } from "../../states/useTransformControlsMode"
import Camera from "../cameras/Camera"
import { euler, quaternion, quaternion_ } from "../utils/reusables"
import SimpleObjectManager from "./SimpleObjectManager"

export default class CharacterCamera extends Camera implements ICharacterCamera {
    public static override defaults = characterCameraDefaults
    public static override schema = characterCameraSchema

    public constructor() {
        super()

        const cam = this.camera
        scene.attach(cam)
        this.then(() => scene.remove(cam))
        
        this.createEffect(() => {
            const target = this.targetState.get()
            if (!target) return

            if ("frustumCulled" in target)
                target.frustumCulled = false

            const handle = onSceneChange(() => target.parent !== this && this.targetState.set(undefined))
            
            return () => {
                handle.cancel()
            }
        }, [this.targetState.get])

        const followTarget = (target: PositionedItem) => {
            euler.setFromQuaternion(target.outerObject3d.quaternion)
            euler.y += Math.PI
            this.outerObject3d.setRotationFromEuler(euler)
            this.updatePolarAngle()
        }
        let transformControlRotating = false

        this.createEffect(() => {
            const target = this.targetState.get()
            if (!target) return

            followTarget(target)
            let targetRotated = false
            //@ts-ignore
            target.onRotationY = () => targetRotated = true

            const handle = loop(() => {
                this.outerObject3d.position.copy(target.outerObject3d.position)
                if (!this.lockTargetRotation) return

                if (this.lockTargetRotation === "follow" || transformControlRotating || targetRotated) {
                    targetRotated = false
                    followTarget(target)
                    return
                }
                euler.setFromQuaternion(this.outerObject3d.quaternion)
                euler.x = 0
                euler.z = 0
                euler.y += Math.PI
                target.outerObject3d.setRotationFromEuler(euler)
            })
            return () => {
                handle.cancel()
                //@ts-ignore
                target.onRotationY = undefined
            }
        }, [this.targetState.get])

        this.createEffect(() => {
            const target = this.targetState.get()
            const selectionTarget = getSelectionTarget()
            const dragging = getTransformControlsDragging()
            const mode = getTransformControlsMode()

            const rotating = target && target === selectionTarget && dragging && mode === "rotate"
            if (!rotating) return
            
            transformControlRotating = true

            return () => {
                transformControlRotating = false
            }
        }, [this.targetState.get, getSelectionTarget, getTransformControlsDragging, getTransformControlsMode])
    }

    public lockTargetRotation: LockTargetRotationValue = true

    protected targetState = new Reactive<PositionedItem | SimpleObjectManager | undefined>(undefined)
    public override append(object: PositionedItem) {
        if (this.targetState.get()) {
            super.append(object)
            return
        }
        this._append(object)
        this.outerObject3d.parent?.add(object.outerObject3d)
        this.targetState.set(object)
    }
    
    public override attach(object: PositionedItem) {
        if (this.targetState.get()) {
            super.attach(object)
            return
        }
        this._append(object)
        this.outerObject3d.parent?.attach(object.outerObject3d)
        this.targetState.set(object)
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