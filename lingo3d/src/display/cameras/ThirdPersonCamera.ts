import CharacterCamera from "../core/CharacterCamera"
import { vector3 } from "../utils/reusables"

export default class ThirdPersonCamera extends CharacterCamera {
    public static override componentName = "thirdPersonCamera"

    public constructor() {
        super()
        this.innerZ = 200
        this.mouseControlMode = "orbit"
        this.watch(this.targetState.get(target => {
            target && this.camera.position.copy(target.outerObject3d.getWorldPosition(vector3))
        }))
        import("../core/mixins/PhysicsMixin/enableBVHCamera").then(module => module.default.call(this))
    }
}