import CharacterCamera from "../core/CharacterCamera"
import { characterCameraSystem } from "../../systems/characterCameraSystem"
import { configFirstPersonCameraSystem } from "../../systems/configSystems/configFirstPersonCameraSystem"
import MeshAppendable from "../core/MeshAppendable"

export default class FirstPersonCamera extends CharacterCamera {
    public static componentName = "firstPersonCamera"

    public constructor() {
        super()
        characterCameraSystem.add(this)
    }

    public $superInnerY(val: number) {
        super.innerY = val
    }
    public $innerYSet?: boolean
    public override get innerY() {
        return super.innerY
    }
    public override set innerY(val) {
        super.innerY = val
        this.$innerYSet = true
        configFirstPersonCameraSystem.delete(this)
    }

    public override append(object: MeshAppendable) {
        super.append(object)
        configFirstPersonCameraSystem.add(this)
    }
}
