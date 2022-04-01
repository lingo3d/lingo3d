import ObjectManager from "../core/ObjectManager"
import CharacterCamera from "../core/CharacterCamera"
import { scaleUp, scaleDown } from "../../engine/constants"
import scene from "../../engine/scene"
import { quaternion, vector3 } from "../utils/reusables"
import { characterCameraDefaults } from "../../interface/ICharacterCamera"

export default class FirstPersonCamera extends CharacterCamera {
    public static override componentName = "firstPersonCamera"
    public static override defaults = characterCameraDefaults

    public constructor() {
        super()

        const cam = this.camera

        scene.attach(cam)
        this.then(() => scene.remove(cam))

        this.loop(() => {
            cam.position.copy(this.object3d.getWorldPosition(vector3))
            cam.quaternion.copy(this.object3d.getWorldQuaternion(quaternion))
        })
    }

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