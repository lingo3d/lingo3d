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
import makeLightSprite from "./core/utils/makeLightSprite"
import { getCameraRendered } from "../states/useCameraRendered"
import mainCamera from "../engine/mainCamera"
import { Reactive } from "@lincode/reactivity"
import { addSelectionHelper } from "./core/StaticObjectManager/raycast/selectionCandidates"

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

            const handle = addSelectionHelper(makeLightSprite(), this)
            return () => {
                handle.cancel()
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
