import { PerspectiveCamera } from "three"
import { camNear, camFar } from "../../engine/constants"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import ICharacterCamera, { characterCameraDefaults, characterCameraSchema, LockTargetRotationValue } from "../../interface/ICharacterCamera"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import { getTransformControlsMode } from "../../states/useTransformControlsMode"
import OrbitCameraBase from "./OrbitCameraBase"
import { euler, quaternion } from "../utils/reusables"
import MeshItem from "./MeshItem"

export default class CharacterCamera extends OrbitCameraBase implements ICharacterCamera {
    public static defaults = characterCameraDefaults
    public static schema = characterCameraSchema

    public constructor() {
        super(new PerspectiveCamera(75, 1, camNear, camFar))

        const cam = this.camera
        scene.attach(cam)
        this.then(() => scene.remove(cam))
        
        this.createEffect(() => {
            const target = this.targetState.get()
            if (!target) return

            if ("frustumCulled" in target)
                target.frustumCulled = false

        }, [this.targetState.get])

        const followTarget = (target: MeshItem, slerp: boolean) => {
            euler.setFromQuaternion(target.outerObject3d.quaternion)
            euler.y += Math.PI
            
            if (slerp) {
                quaternion.setFromEuler(euler)
                this.outerObject3d.quaternion.slerp(quaternion, 0.1)
            }
            else this.outerObject3d.setRotationFromEuler(euler)

            this.updateAngle()
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
            const handle0 = onBeforeRender(() => {
                const { x: x0, y: y0, z: z0 } = target.outerObject3d.position
                targetMoved = x0 !== x || y0 !== y || z0 !== z
                ;[x, y, z] = [x0, y0, z0]
            })

            const handle1 = onBeforeRender(() => {
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
                handle0.cancel()
                handle1.cancel()
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
}