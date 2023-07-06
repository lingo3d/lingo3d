import { Object3D, PerspectiveCamera } from "three"
import scene from "../../engine/scene"
import ICharacterCamera, {
    characterCameraDefaults,
    characterCameraSchema,
    LockTargetRotationValue
} from "../../interface/ICharacterCamera"
import { FAR, NEAR } from "../../globals"
import CameraBase from "./CameraBase"
import MeshAppendable from "./MeshAppendable"
import { characterCameraTransformEditSystem } from "../../systems/eventSystems/characterCameraTransformEditSystem"
import getParent from "./utils/getParent"
import { appendToCharacterCameraSystem } from "../../systems/configSystems/appendToCharacterCameraSystem"

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

        scene.attach(this.$camera)
        characterCameraTransformEditSystem.add(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        scene.remove(this.$camera)
    }

    public lockTargetRotation: LockTargetRotationValue = true

    public override append(object: MeshAppendable) {
        this.$appendNode(object)
        getParent(object.outerObject3d) !== scene &&
            scene.attach(object.outerObject3d)
        appendToCharacterCameraSystem.add(this)
    }

    public override attach(object: MeshAppendable) {
        this.append(object)
    }
}
