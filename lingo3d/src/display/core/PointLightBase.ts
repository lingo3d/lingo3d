import {
    Sphere,
    SpotLightHelper,
    PointLight as ThreePointLight,
    SpotLight as ThreeSpotLight
} from "three"
import { CM2M, M2CM } from "../../globals"
import IPointLightBase from "../../interface/IPointLightBase"
import LightBase from "./LightBase"
import { Cancellable } from "@lincode/promiselikes"
import {
    addLightIntensitySystem,
    deleteLightIntensitySystem
} from "../../systems/lightIntensitySystem"
import { addConfigCastShadowPhysicsSystem } from "../../systems/configSystems/configCastShadowPhysicsSystem"

export default abstract class PointLightBase<
        T extends ThreePointLight | ThreeSpotLight
    >
    extends LightBase<T>
    implements IPointLightBase
{
    public constructor(light: T, helper?: typeof SpotLightHelper) {
        super(light, helper)
        this.distance = 500
        this.intensity = 10
        addLightIntensitySystem(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        deleteLightIntensitySystem(this)
    }

    public $boundingSphere = new Sphere()
    public get distance() {
        return this.object3d.distance * M2CM
    }
    public set distance(val) {
        this.object3d.distance = val * CM2M
    }

    protected abstract addShadowResolutionSystem: (
        object: this,
        data: { step: number | undefined }
    ) => void
    protected abstract deleteShadowResolutionSystem: (object: this) => void

    private _castShadow = false
    public get castShadow() {
        return this._castShadow
    }
    public set castShadow(val) {
        this._castShadow = val

        const light = this.object3d
        light.castShadow = !!val

        this.cancelHandle(
            "castShadowResolution",
            val &&
                (() => {
                    this.addShadowResolutionSystem(this, {
                        step: undefined
                    })
                    return new Cancellable(() =>
                        this.deleteShadowResolutionSystem(this)
                    )
                })
        )
        addConfigCastShadowPhysicsSystem(this)
    }

    private _intensity = 1
    public override get intensity() {
        return this._intensity
    }
    public override set intensity(val) {
        this._intensity = val
    }

    private _enabled = true
    public override get enabled() {
        return this._enabled
    }
    public override set enabled(val) {
        this._enabled = val
    }
}
