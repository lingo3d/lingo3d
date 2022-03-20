import ObjectManager from "../core/ObjectManager"
import CharacterCamera from "../core/CharacterCamera"
import { scaleUp, scaleDown } from "../../engine/constants"

export default class FirstPersonCamera extends CharacterCamera {
    public static override componentName = "firstPersonCamera"

    private _innerY?: number
    public override get innerY() {
        return this.object3d.position.y * scaleUp
    }
    public override set innerY(val: number) {
        this._innerY = this.object3d.position.y = val * scaleDown
    }

    public override get target() {
        return this._target
    }
    public override set target(target: ObjectManager | undefined) {
        target && this._innerY === undefined && (this.innerY = target.height * 0.4)
        super.target = target
    }
}