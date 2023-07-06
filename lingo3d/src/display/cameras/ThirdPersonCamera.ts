import IThirdPersonCamera, {
    thirdPersonCameraDefaults,
    thirdPersonCameraSchema
} from "../../interface/IThirdPersonCamera"
import { appendToThirdPersonCameraSystem } from "../../systems/configSystems/appendToThirdPersonCameraSystem"
import CharacterCamera from "../core/CharacterCamera"
import MeshAppendable from "../core/MeshAppendable"

export default class ThirdPersonCamera
    extends CharacterCamera
    implements IThirdPersonCamera
{
    public static componentName = "thirdPersonCamera"
    public static override defaults = thirdPersonCameraDefaults
    public static override schema = thirdPersonCameraSchema

    public constructor() {
        super()
        this.innerZ = 300
        this.orbitMode = true
    }

    public override append(object: MeshAppendable) {
        super.append(object)
        appendToThirdPersonCameraSystem.add(this)
    }
}
