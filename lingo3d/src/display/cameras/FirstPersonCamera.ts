import CharacterCamera from "../core/CharacterCamera"
import { scaleUp, scaleDown } from "../../engine/constants"
import scene from "../../engine/scene"
import { quaternion, vector3 } from "../utils/reusables"
import SimpleObjectManager from "../core/SimpleObjectManager"
import PositionedItem from "../../api/core/PositionedItem"

export default class FirstPersonCamera extends CharacterCamera {
    public static override componentName = "firstPersonCamera"

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
        return this.targetState.get()
    }
    public override set target(target: SimpleObjectManager | PositionedItem | undefined) {
        target && ("height" in target) && this._innerY === undefined && (this.innerY = target.height * 0.4)
        super.target = target
    }
}