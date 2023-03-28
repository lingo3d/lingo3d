import { Object3D, PerspectiveCamera } from "three"
import scene from "../../engine/scene"
import ICharacterCamera, {
    characterCameraDefaults,
    characterCameraSchema,
    LockTargetRotationValue
} from "../../interface/ICharacterCamera"
import { euler, quaternion } from "../utils/reusables"
import { FAR, NEAR, PI } from "../../globals"
import fpsAlpha from "../utils/fpsAlpha"
import { positionChangedXZ } from "../utils/trackObject"
import CameraBase, { addUpdateAngleSystem } from "./CameraBase"
import MeshAppendable from "../../api/core/MeshAppendable"
import renderSystem from "../../utils/renderSystem"
import getWorldPosition from "../utils/getWorldPosition"
import getWorldQuaternion from "../utils/getWorldQuaternion"
import renderSystemWithData from "../../utils/renderSystemWithData"
import { isPositionedManager } from "./PositionedManager"

export const [addCharacterCameraSystem, deleteCharacterCameraSystem] =
    renderSystem((self: CharacterCamera) => {
        self.camera.position.copy(getWorldPosition(self.object3d))
        self.camera.quaternion.copy(getWorldQuaternion(self.object3d))
    })

const rotateTarget = (
    self: CharacterCamera,
    target: MeshAppendable,
    slerp: boolean
) => {
    euler.setFromQuaternion(self.midObject3d.quaternion)
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

const followTargetRotation = (
    self: CharacterCamera,
    target: MeshAppendable,
    slerp: boolean
) => {
    euler.setFromQuaternion(target.quaternion)
    euler.y += PI

    if (slerp) {
        quaternion.setFromEuler(euler)
        self.midObject3d.quaternion.slerp(quaternion, fpsAlpha(0.1))
    } else self.midObject3d.setRotationFromEuler(euler)

    addUpdateAngleSystem(self)
}

const [addCameraSystem, deleteCameraSystem] = renderSystemWithData(
    (self: CharacterCamera, { found }: { found: MeshAppendable }) => {
        self.position.copy(found.position)

        if (!self.lockTargetRotation) return

        if (self.lockTargetRotation === "follow") {
            followTargetRotation(self, found, false)
            return
        }
        if (self.lockTargetRotation === "dynamic-lock") {
            positionChangedXZ(found.outerObject3d) &&
                rotateTarget(self, found, true)
            return
        }
        if (self.lockTargetRotation === "dynamic-follow") {
            positionChangedXZ(found.outerObject3d) &&
                followTargetRotation(self, found, true)
            return
        }
        rotateTarget(self, found, false)
    }
)

export default class CharacterCamera
    extends CameraBase
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
            const found = this.firstChildState.get()
            if (!found) return
            if ("frustumCulled" in found) found.frustumCulled = false
        }, [this.firstChildState.get])

        this.createEffect(() => {
            const found = this.firstChildState.get()
            if (!(found instanceof MeshAppendable)) return

            followTargetRotation(this, found, false)

            addCameraSystem(this, { found })
            return () => {
                deleteCameraSystem(this)
            }
        }, [this.firstChildState.get])

        this.createEffect(() => {
            const found = this.firstChildState.get()
            if (!isPositionedManager(found)) return

            let { lockTargetRotation } = this
            found.onTransformControls = (phase, mode) => {
                if (mode !== "rotate") return
                if (phase === "start") {
                    lockTargetRotation = this.lockTargetRotation
                    this.lockTargetRotation = "follow"
                } else if (phase === "end")
                    this.lockTargetRotation = lockTargetRotation
            }
            return () => {
                found.onTransformControls = undefined
            }
        }, [this.firstChildState.get])
    }

    public lockTargetRotation: LockTargetRotationValue = true

    public override append(object: MeshAppendable) {
        this.appendNode(object)
        object.outerObject3d.parent !== scene &&
            scene.attach(object.outerObject3d)
    }

    public override attach(object: MeshAppendable) {
        this.append(object)
    }
}
