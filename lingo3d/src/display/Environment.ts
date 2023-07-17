import {
    pullEnvironmentStack,
    pushEnvironmentStack,
    refreshEnvironmentStack
} from "../states/useEnvironmentStack"
import IEnvironment, {
    environmentDefaults,
    EnvironmentPreset,
    environmentSchema
} from "../interface/IEnvironment"
import HelperSprite from "./core/helperPrimitives/HelperSprite"
import MeshAppendable from "./core/MeshAppendable"
import { helperSystem } from "../systems/eventSystems/helperSystem"
import { configHelperSystem } from "../systems/configSystems/configHelperSystem"

export default class Environment
    extends MeshAppendable
    implements IEnvironment
{
    public static componentName = "environment"
    public static defaults = environmentDefaults
    public static schema = environmentSchema

    public $createHelper() {
        return new HelperSprite("light", this)
    }

    public constructor() {
        super()
        pushEnvironmentStack(this)
        helperSystem.add(this)
        configHelperSystem.add(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        pullEnvironmentStack(this)
    }

    private _texture?: string | EnvironmentPreset = "studio"
    public get texture() {
        return this._texture
    }
    public set texture(value) {
        this._texture = value
        refreshEnvironmentStack()
    }
}
