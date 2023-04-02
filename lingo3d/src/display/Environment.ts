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
import { Reactive } from "@lincode/reactivity"
import HelperSprite from "./core/utils/HelperSprite"
import { getEditorHelper } from "../states/useEditorHelper"
import { addSelectionHelper } from "./core/utils/raycast/addSelectionHelper"
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
            if (!getEditorHelper() || !this.helperState.get()) return

            const handle = addSelectionHelper(new HelperSprite("light"), this)
            return () => {
                handle.cancel()
            }
        }, [getEditorHelper, this.helperState.get])
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

    private helperState = new Reactive(true)
    public get helper() {
        return this.helperState.get()
    }
    public set helper(val) {
        this.helperState.set(val)
    }
}
