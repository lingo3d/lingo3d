import CharacterCamera from "../core/CharacterCamera"

export default class ThirdPersonCamera extends CharacterCamera {
    public constructor() {
        super()
        this.innerZ = 200
        this.mouseControlMode = "orbit"
    }
}