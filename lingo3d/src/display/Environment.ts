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
import HelperSprite from "./core/utils/HelperSprite"
import MeshAppendable from "./core/MeshAppendable"
import { getWorldPlay } from "../states/useWorldPlay"
import { worldPlayPtr } from "../pointers/worldPlayPtr"

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
            if (worldPlayPtr[0] !== "editor" || this.$disableSceneGraph) return
            const helper = new HelperSprite("light", this)
            return () => {
                helper.dispose()
            }
        }, [getWorldPlay])
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
