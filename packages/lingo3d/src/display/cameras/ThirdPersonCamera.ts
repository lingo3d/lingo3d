import CharacterCamera from "../core/CharacterCamera"

export default class ThirdPersonCamera extends CharacterCamera {
    public static override componentName = "thirdPersonCamera"

    public constructor() {
        super()
        this.innerZ = 200
        this.mouseControlMode = "orbit"
        import("../core/SimpleObjectManager/PhysicsItem/enableBVHCamera").then(module => module.default.call(this))
    }
}