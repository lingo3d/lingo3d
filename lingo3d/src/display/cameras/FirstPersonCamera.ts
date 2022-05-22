import CharacterCamera from "../core/CharacterCamera"
import { scaleUp, scaleDown } from "../../engine/constants"
import { quaternion, vector3 } from "../utils/reusables"

export default class FirstPersonCamera extends CharacterCamera {
    public static override componentName = "firstPersonCamera"

    public constructor() {
        super()

        const cam = this.camera
        this.loop(() => {
            cam.position.copy(this.object3d.getWorldPosition(vector3))
            cam.quaternion.copy(this.object3d.getWorldQuaternion(quaternion))
        })
        
        this.createEffect(() => {
            const target = this.targetState.get()
            if (!target || !("height" in target) || this._innerY !== undefined) return

            this.innerY = target.height * 0.4

            return () => {
                this.innerY = 0
            }
        }, [this.targetState.get])
    }

    private _innerY?: number
    public override get innerY() {
        return this.object3d.position.y * scaleUp
    }
    public override set innerY(val: number) {
        this._innerY = this.object3d.position.y = val * scaleDown
    }
}