import { Object3D, PerspectiveCamera } from "three"
import { camNear, camFar } from "../../engine/constants"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import ICharacterCamera, {
    characterCameraDefaults,
    characterCameraSchema,
    LockTargetRotationValue
} from "../../interface/ICharacterCamera"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import { getTransformControlsMode } from "../../states/useTransformControlsMode"
import OrbitCameraBase from "./OrbitCameraBase"
import { euler, halfPi, quaternion } from "../utils/reusables"
import MeshItem from "./MeshItem"

const dirObj = new Object3D()

export default class CharacterCamera
    extends OrbitCameraBase
    implements ICharacterCamera
{
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

            if ("frustumCulled" in target) target.frustumCulled = false
        }, [this.targetState.get])

        const followTargetRotation = (target: MeshItem, slerp: boolean) => {
            euler.setFromQuaternion(target.outerObject3d.quaternion)
            euler.y += Math.PI

            if (slerp) {
                quaternion.setFromEuler(euler)
                this.midObject3d.quaternion.slerp(quaternion, 0.1)
            } else this.midObject3d.setRotationFromEuler(euler)

            this.updateAngle()
        }

        const lockTargetRotation = (target: MeshItem, slerp: boolean) => {
            euler.setFromQuaternion(this.midObject3d.quaternion)
            euler.x = 0
            euler.z = 0
            euler.y += Math.PI

            if (slerp) {
                quaternion.setFromEuler(euler)
                target.outerObject3d.quaternion.slerp(quaternion, 0.1)
            } else target.outerObject3d.setRotationFromEuler(euler)
        }

        let transformControlRotating = false

        this.createEffect(() => {
            const target = this.targetState.get()
            if (!target) return

            followTargetRotation(target, false)

            let [xOld, yOld, zOld] = [0, 0, 0]
            const targetMoved = () => {
                const { x, y, z } = target.outerObject3d.position
                const result = x !== xOld || y !== yOld || z !== zOld
                ;[xOld, yOld, zOld] = [x, y, z]
                return result
            }

            const handle = onBeforeRender(() => {
                this.outerObject3d.position.copy(target.outerObject3d.position)

                //@ts-ignore
                const dir = target.bvhDir
                if (dir) {
                    dirObj.lookAt(dir)
                    dirObj.rotateX(halfPi)
                    this.outerObject3d.quaternion.copy(dirObj.quaternion)
                    return
                }
                
                if (!this.lockTargetRotation) return

                if (
                    this.lockTargetRotation === "follow" ||
                    transformControlRotating
                ) {
                    followTargetRotation(target, false)
                    return
                }
                if (this.lockTargetRotation === "dynamic-lock") {
                    targetMoved() && lockTargetRotation(target, true)
                    return
                }
                if (this.lockTargetRotation === "dynamic-follow") {
                    targetMoved() && followTargetRotation(target, true)
                    return
                }
                lockTargetRotation(target, false)
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

            const rotating =
                target &&
                target === selectionTarget &&
                dragging &&
                mode === "rotate"
            if (!rotating) return

            transformControlRotating = true

            return () => {
                transformControlRotating = false
            }
        }, [
            this.targetState.get,
            getSelectionTarget,
            getTransformControlsDragging,
            getTransformControlsMode
        ])
    }

    public lockTargetRotation: LockTargetRotationValue = true
}
