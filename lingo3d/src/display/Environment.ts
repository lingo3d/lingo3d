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
import { getEditorHelper } from "../states/useEditorHelper"
import MeshAppendable from "../api/core/MeshAppendable"

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
            if (!getEditorHelper() || this.$disableSceneGraph) return
            const helper = new HelperSprite("light", this)
            return () => {
                helper.dispose()
            }
        }, [getEditorHelper])
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
