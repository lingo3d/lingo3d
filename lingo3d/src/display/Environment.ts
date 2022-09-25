import {
    pullEnvironmentStack,
    pushEnvironmentStack,
    refreshEnvironmentStack
} from "../states/useEnvironmentStack"
import IEnvironment, {
    environmentDefaults,
    environmentSchema
} from "../interface/IEnvironment"
import PositionedItem from "../api/core/PositionedItem"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import makeLightSprite from "./core/utils/makeLightSprite"
import { getCameraRendered } from "../states/useCameraRendered"
import mainCamera from "../engine/mainCamera"
import { Reactive } from "@lincode/reactivity"

export default class Environment
    extends PositionedItem
    implements IEnvironment
{
    public static componentName = "environment"
    public static defaults = environmentDefaults
    public static schema = environmentSchema

    public constructor() {
        super()
        pushEnvironmentStack(this)

        this.createEffect(() => {
            if (getCameraRendered() !== mainCamera || !this.helperState.get())
                return

            const sprite = makeLightSprite()
            this.outerObject3d.add(sprite.outerObject3d)
            sprite.onClick = () => {
                emitSelectionTarget(this)
            }
            return () => {
                sprite.dispose()
            }
        }, [getCameraRendered, this.helperState.get])
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        pullEnvironmentStack(this)
        return this
    }

    private _texture?: string | "studio" | "dynamic" = "studio"
    public get texture() {
        return this._texture
    }
    public set texture(value) {
        this._texture = value
        refreshEnvironmentStack()
    }

    private helperState = new Reactive(true)
    public get helper() {
        return this.helperState.get()
    }
    public set helper(val) {
        this.helperState.set(val)
    }
}
