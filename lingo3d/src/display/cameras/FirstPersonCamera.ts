import ObjectManager from "../core/ObjectManager"
import CharacterCamera from "../core/CharacterCamera"

export default class FirstPersonCamera extends CharacterCamera {
    public static override componentName = "firstPersonCamera"

    public override get target() {
        return this._target
    }
    public override set target(target: ObjectManager | undefined) {
        target && (this.innerY = target.height / 2)
        super.target = target
    }
}