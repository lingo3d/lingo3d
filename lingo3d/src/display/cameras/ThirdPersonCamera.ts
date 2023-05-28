import IThirdPersonCamera, {
    thirdPersonCameraDefaults,
    thirdPersonCameraSchema
} from "../../interface/IThirdPersonCamera"
import CharacterCamera from "../core/CharacterCamera"
import MeshAppendable from "../core/MeshAppendable"
import {
    addCharacterCameraSystem,
    deleteCharacterCameraSystem
} from "../../systems/characterCameraSystem"
import { thirdPersonCameraSystem } from "../../systems/thirdPersonCameraSystem"

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

        this.createEffect(() => {
            const found = this.firstChildState.get()
            if (!(found instanceof MeshAppendable)) {
                addCharacterCameraSystem(this)
                return () => {
                    deleteCharacterCameraSystem(this)
                }
            }
            thirdPersonCameraSystem.add(this, { found, lerpCount: 0 })
            return () => {
                thirdPersonCameraSystem.delete(this)
            }
        }, [this.firstChildState.get])
    }
}
