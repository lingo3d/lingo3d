import CharacterCamera from "../core/CharacterCamera"
import SimpleObjectManager from "../core/SimpleObjectManager"
import { Reactive } from "@lincode/reactivity"
import getWorldPosition from "../utils/getWorldPosition"
import getWorldQuaternion from "../utils/getWorldQuaternion"
import { onBeforeRender } from "../../events/onBeforeRender"

export default class FirstPersonCamera extends CharacterCamera {
    public static componentName = "firstPersonCamera"

    public constructor() {
        super()

        const cam = this.camera

        this.watch(onBeforeRender(() => {
            cam.position.copy(getWorldPosition(this.object3d))
            cam.quaternion.copy(getWorldQuaternion(this.object3d))
        }))

        this.createEffect(() => {
            const target = this.targetState.get()
            const innerYSet = this.innerYSetState.get()
            if (!target || !(target instanceof SimpleObjectManager) || innerYSet) return
            super.innerY = target.height * 0.4

            return () => {
                super.innerY = 0
            }
        }, [this.targetState.get, this.innerYSetState.get])
    }

    private innerYSetState = new Reactive(false)
    public override get innerY() {
        return super.innerY
    }
    public override set innerY(val: number) {
        super.innerY = val
        this.innerYSetState.set(true)
    }
}