import {
    pullSkyboxStack,
    pushSkyboxStack,
    refreshSkyboxStack
} from "../states/useSkyboxStack"
import ISkybox, { skyboxDefaults, skyboxSchema } from "../interface/ISkybox"
import Appendable from "./core/Appendable"

export default class Skybox extends Appendable implements ISkybox {
    public static componentName = "skybox"
    public static defaults = skyboxDefaults
    public static schema = skyboxSchema

    public constructor() {
        super()
        pushSkyboxStack(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        pullSkyboxStack(this)
    }

    private _texture?: string | Array<string>
    public get texture() {
        return this._texture
    }
    public set texture(value) {
        this._texture = value
        refreshSkyboxStack()
    }
}
