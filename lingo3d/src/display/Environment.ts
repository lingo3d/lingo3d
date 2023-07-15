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
import { getWorldMode } from "../states/useWorldMode"
import { worldModePtr } from "../pointers/worldModePtr"

export default class Environment
    extends MeshAppendable
    implements IEnvironment
{
    public static componentName = "environment"
    public static defaults = environmentDefaults
    public static schema = environmentSchema

    public constructor() {
        super()
        pushEnvironmentStack(this)

        this.createEffect(() => {
            if (worldModePtr[0] !== "editor" || this.$disableSceneGraph) return
            const helper = new HelperSprite("light", this)
            return () => {
                helper.dispose()
            }
        }, [getWorldMode])
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
