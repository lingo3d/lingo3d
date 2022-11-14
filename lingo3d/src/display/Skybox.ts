import {
    getSkyboxStack,
    pullSkyboxStack,
    pushSkyboxStack,
    setSkyboxStack
} from "../states/useSkyboxStack"
import ISkybox, { skyboxDefaults, skyboxSchema } from "../interface/ISkybox"
import Appendable from "../api/core/Appendable"

export default class Skybox extends Appendable implements ISkybox {
    public static componentName = "skybox"
    public static defaults = skyboxDefaults
    public static schema = skyboxSchema

    public constructor() {
        super()
        pushSkyboxStack(this)
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        pullSkyboxStack(this)
        return this
    }

    private _texture?: string | Array<string>
    public get texture() {
        return this._texture
    }
    public set texture(value) {
        this._texture = value
        setSkyboxStack([...getSkyboxStack()])
    }
}
