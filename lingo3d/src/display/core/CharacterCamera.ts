import { deg2Rad } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { Reactive } from "@lincode/reactivity"
import { debounce } from "@lincode/utils"
import { Quaternion } from "three"
import Appendable from "../../api/core/Appendable"
import PositionedItem from "../../api/core/PositionedItem"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import { onSceneGraphChange } from "../../events/onSceneGraphChange"
import ICharacterCamera, { characterCameraDefaults, characterCameraSchema, LockTargetRotationValue } from "../../interface/ICharacterCamera"
import Nullable from "../../interface/utils/Nullable"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import { getTransformControlsMode } from "../../states/useTransformControlsMode"
import Camera from "../cameras/Camera"
import { euler, quaternion, quaternion_ } from "../utils/reusables"
import MeshItem, { isMeshItem } from "./MeshItem"

const attachSet = new WeakSet<Appendable>()

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

            const handle = onSceneGraphChange(() => target.parent !== this && this.retarget())
            
            return () => {
                handle.cancel()
            }
        }, [this.targetState.get])

        const followTarget = (target: MeshItem, slerp: boolean) => {
            euler.setFromQuaternion(target.outerObject3d.quaternion)
            euler.y += Math.PI
            
            if (slerp) {
                quaternion.setFromEuler(euler)
                this.outerObject3d.quaternion.slerp(quaternion, 0.1)
            }
            else this.outerObject3d.setRotationFromEuler(euler)

            this.updatePolarAngle()
        }

        const lockTarget = (target: MeshItem, slerp: boolean) => {
            euler.setFromQuaternion(this.outerObject3d.quaternion)
            euler.x = 0
            euler.z = 0
            euler.y += Math.PI

            if (slerp) {
                quaternion.setFromEuler(euler)
                target.outerObject3d.quaternion.slerp(quaternion, 0.1)
            }
            else target.outerObject3d.setRotationFromEuler(euler)
        }

        let transformControlRotating = false

        this.createEffect(() => {
            const target = this.targetState.get()
            if (!target) return

            followTarget(target, false)

            let targetMoved = false
            let [x, y, z] = [0, 0, 0]
            onBeforeRender(() => {
                const { x: x0, y: y0, z: z0 } = target.outerObject3d.position
                targetMoved = x0 !== x || y0 !== y || z0 !== z
                ;[x, y, z] = [x0, y0, z0]
            })

            const handle = onBeforeRender(() => {
                this.outerObject3d.position.copy(target.outerObject3d.position)
                if (!this.lockTargetRotation) return

                if (this.lockTargetRotation === "follow" || transformControlRotating) {
                    followTarget(target, false)
                    return
                }
                if (this.lockTargetRotation === "dynamic-lock") {
                    targetMoved && lockTarget(target, true)
                    return
                }
                if (this.lockTargetRotation === "dynamic-follow") {
                    targetMoved && followTarget(target, true)
                    return
                }
                lockTarget(target, false)
            })
            return () => {
                handle.cancel()
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

    public target: Nullable<MeshItem>

    protected targetState = new Reactive<MeshItem | undefined>(undefined)

    private retarget = debounce(() => {
        let target: MeshItem | undefined
        for (const child of this.children ?? [])
            if (target) {
                if (child.outerObject3d.parent !== this.camera)
                    this.camera[attachSet.has(child) ? "attach" : "add"](child.outerObject3d)
            }
            else if (isMeshItem(child)) {
                target = child
                const { parent } = this.outerObject3d
                if (parent && child.outerObject3d.parent !== parent)
                    parent[attachSet.has(target) ? "attach" : "add"](target.outerObject3d)
            }

        this.targetState.set(target)

    }, 0, "trailing")

    public override append(object: PositionedItem) {
        this._append(object)
        attachSet.delete(object)
        this.retarget()
    }
    
    public override attach(object: PositionedItem) {
        this._append(object)
        attachSet.add(object)
        this.retarget()
    }
    
    private _gyroControl?: boolean
    public get gyroControl() {
        return !!this._gyroControl
    }
    public set gyroControl(val: boolean) {
        if (this._gyroControl === val) return
        this._gyroControl = val

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
        val && window.addEventListener("deviceorientation", cb)
        this.cancelHandle("gyroControl", val && new Cancellable(() => window.removeEventListener("deviceorientation", cb)))
    }
}