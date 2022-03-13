import { applyMixins } from "@lincode/utils"
import { SpotLight as ThreeSpotLight, SpotLightHelper } from "three"
import LightBase from "../core/LightBase"
import PointLightMixin from "../core/mixins/PointLightMixin"
import ISpotLight from "../../interface/ISpotLight"

class SpotLight extends LightBase<ThreeSpotLight> implements ISpotLight {
    public constructor() {
        super(new ThreeSpotLight(), SpotLightHelper)
    }

    public get angle() {
        return this.object3d.angle
    }
    public set angle(val: number) {
        this.object3d.angle = val
    }

    public get penumbra() {
        return this.object3d.penumbra
    }
    public set penumbra(val: number) {
        this.object3d.penumbra = val
    }
}
interface SpotLight extends LightBase<ThreeSpotLight>, PointLightMixin<ThreeSpotLight> {}
applyMixins(SpotLight, [PointLightMixin])
export default SpotLight