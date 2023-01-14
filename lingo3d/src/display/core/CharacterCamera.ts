import { Object3D, PerspectiveCamera } from "three"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import ICharacterCamera, {
    characterCameraDefaults,
    characterCameraSchema,
    LockTargetRotationValue
} from "../../interface/ICharacterCamera"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import OrbitCameraBase from "./OrbitCameraBase"
import { euler, quaternion } from "../utils/reusables"
import { FAR, NEAR, PI } from "../../globals"
import fpsAlpha from "../utils/fpsAlpha"
import { positionChangedXZ } from "../utils/trackObject"
import { getEditorModeComputed } from "../../states/useEditorModeComputed"
import { updateAngleSystem } from "./CameraBase"
import MeshAppendable from "../../api/core/MeshAppendable"

export default class CharacterCamera
    extends OrbitCameraBase
    implements ICharacterCamera
{
    public static defaults = characterCameraDefaults
    public static schema = characterCameraSchema

    public constructor() {
        super(new PerspectiveCamera(75, 1, NEAR, FAR))

        const midObject3d = (this.midObject3d = new Object3D())
        this.outerObject3d.add(midObject3d)
        midObject3d.add(this.object3d)

        const cam = this.camera
        scene.attach(cam)
        this.then(() => scene.remove(cam))

        this.createEffect(() => {
            const found = this.foundState.get()
            if (!found) return

            if ("frustumCulled" in found) found.frustumCulled = false
        }, [this.foundState.get])

        const followTargetRotation = (
            target: MeshAppendable,
            slerp: boolean
        ) => {
            euler.setFromQuaternion(target.quaternion)
            euler.y += PI

            if (slerp) {
                quaternion.setFromEuler(euler)
                midObject3d.quaternion.slerp(quaternion, fpsAlpha(0.1))
            } else midObject3d.setRotationFromEuler(euler)

            updateAngleSystem(this)
        }

        const rotateTarget = (target: MeshAppendable, slerp: boolean) => {
            euler.setFromQuaternion(this.midObject3d.quaternion)
            euler.x = 0
            euler.z = 0
            euler.y += PI

            if (slerp) {
                quaternion.setFromEuler(euler)
                target.quaternion.slerp(quaternion, fpsAlpha(0.1))
                return
            }
            target.outerObject3d.setRotationFromEuler(euler)
        }

        let transformControlRotating = false

        this.createEffect(() => {
            const found = this.foundState.get()
            if (!found) return

            followTargetRotation(found, false)

            const handle = onBeforeRender(() => {
                this.position.copy(found.position)

                if (!this.lockTargetRotation) return

                if (
                    this.lockTargetRotation === "follow" ||
                    transformControlRotating
                ) {
                    followTargetRotation(found, false)
                    return
                }
                if (this.lockTargetRotation === "dynamic-lock") {
                    positionChangedXZ(found.outerObject3d) &&
                        rotateTarget(found, true)
                    return
                }
                if (this.lockTargetRotation === "dynamic-follow") {
                    positionChangedXZ(found.outerObject3d) &&
                        followTargetRotation(found, true)
                    return
                }
                rotateTarget(found, false)
            })
            return () => {
                handle.cancel()
            }
        }, [this.foundState.get])

        this.createEffect(() => {
            const target = this.foundState.get()
            const selectionTarget = getSelectionTarget()
            const dragging = getTransformControlsDragging()
            const mode = getEditorModeComputed()

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
            this.foundState.get,
            getSelectionTarget,
            getTransformControlsDragging,
            getEditorModeComputed
        ])
    }

    public lockTargetRotation: LockTargetRotationValue = true
}
