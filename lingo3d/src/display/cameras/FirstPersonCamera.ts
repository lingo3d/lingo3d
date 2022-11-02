import CharacterCamera from "../core/CharacterCamera"
import { Reactive } from "@lincode/reactivity"
import getWorldPosition from "../utils/getWorldPosition"
import getWorldQuaternion from "../utils/getWorldQuaternion"
import { onObjectMove } from "../../api/core/PositionedItem"

export default class FirstPersonCamera extends CharacterCamera {
    public static componentName = "firstPersonCamera"

    public constructor() {
        super()

        this.watch(
            onObjectMove(this.object3d, () => {
                this.camera.position.copy(getWorldPosition(this.object3d))
                this.camera.quaternion.copy(getWorldQuaternion(this.object3d))
            })
        )
        this.createEffect(() => {
            const found = this.foundState.get()
            const innerYSet = this.innerYSetState.get()
            if (!found || !("height" in found) || innerYSet) return
            super.innerY = found.height * 0.4

            return () => {
                super.innerY = 0
            }
        }, [this.foundState.get, this.innerYSetState.get])
    }

    private innerYSetState = new Reactive(false)
    public override get innerY() {
        return super.innerY
    }
    public override set innerY(val) {
        super.innerY = val
        this.innerYSetState.set(true)
    }
}
