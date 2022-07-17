import {
    DirectionalLightHelper,
    DirectionalLight as ThreeDirectionalLight,
    OrthographicCamera
} from "three"
import { scaleDown } from "../../engine/constants"
import IDirectionalLight, {
    directionalLightDefaults,
    directionalLightSchema
} from "../../interface/IDirectionalLight"
import LightBase from "../core/LightBase"

export default class DirectionalLight
    extends LightBase<ThreeDirectionalLight>
    implements IDirectionalLight
{
    public static componentName = "directionalLight"
    public static defaults = directionalLightDefaults
    public static schema = directionalLightSchema

    private shadowCamera: OrthographicCamera

    public constructor() {
        const light = new ThreeDirectionalLight()
        super(light, DirectionalLightHelper)
        this.shadowCamera = light.shadow.camera
    }

    private _shadowArea = 1000
    public get shadowArea() {
        return this._shadowArea
    }
    public set shadowArea(val) {
        this._shadowArea = val

        const value = val * 0.5 * scaleDown
        this.shadowCamera.left = -value
        this.shadowCamera.right = value
        this.shadowCamera.top = value
        this.shadowCamera.bottom = -value
        this.shadowCamera.updateProjectionMatrix()
    }
}
