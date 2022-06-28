import { thirdPersonCameraDefaults, thirdPersonCameraSchema } from "../../interface/IThirdPersonCamera"
import CharacterCamera from "../core/CharacterCamera"

export default class ThirdPersonCamera extends CharacterCamera {
    public static componentName = "thirdPersonCamera"
    public static override defaults = thirdPersonCameraDefaults
    public static override schema = thirdPersonCameraSchema

    public constructor() {
        super()
        this.innerZ = 300
        this.orbitMode = true

        import("../core/mixins/PhysicsMixin/enableBVHCamera").then(module => module.default.call(this))
    }
}