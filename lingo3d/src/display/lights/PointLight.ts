import { applyMixins } from "@lincode/utils"
import { PointLight as ThreePointLight, PointLightHelper } from "three"
import ILight from "../../interface/ILight"
import LightBase from "../core/LightBase"
import PointLightMixin from "../core/mixins/PointLightMixin"

class PointLight extends LightBase<ThreePointLight> implements ILight {
    public constructor() {
        super(new ThreePointLight(), PointLightHelper)
    }
}
interface PointLight extends LightBase<ThreePointLight>, PointLightMixin<ThreePointLight> {}
applyMixins(PointLight, [PointLightMixin])
export default PointLight