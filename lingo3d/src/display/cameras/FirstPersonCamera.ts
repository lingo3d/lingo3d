import CharacterCamera from "../core/CharacterCamera"
import { Reactive } from "@lincode/reactivity"
import ObjectManager from "../core/ObjectManager"
import { characterCameraSystem } from "../../systems/characterCameraSystem"

export default class FirstPersonCamera extends CharacterCamera {
    public static componentName = "firstPersonCamera"

    public constructor() {
        super()

        characterCameraSystem.add(this)

        this.createEffect(() => {
            const found = this.firstChildState.get()
            const innerYSet = this.innerYSetState.get()
            if (!(found instanceof ObjectManager) || innerYSet) return
            super.innerY = found.height * 0.4

            return () => {
                super.innerY = 0
            }
        }, [this.firstChildState.get, this.innerYSetState.get])
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
