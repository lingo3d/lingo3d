import {
    pullEnvironmentStack,
    pushEnvironmentStack,
    refreshEnvironmentStack
} from "../states/useEnvironmentStack"
import IEnvironment, {
    environmentDefaults,
    environmentSchema
} from "../interface/IEnvironment"
import EventLoopItem from "../api/core/EventLoopItem"

export default class Environment extends EventLoopItem implements IEnvironment {
    public static componentName = "environment"
    public static defaults = environmentDefaults
    public static schema = environmentSchema

    public constructor() {
        super()
        pushEnvironmentStack(this)
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        pullEnvironmentStack(this)
        return this
    }

    private _texture?: string | "studio" | "dynamic"
    public get texture() {
        return this._texture
    }
    public set texture(value) {
        this._texture = value
        refreshEnvironmentStack()
    }
}
