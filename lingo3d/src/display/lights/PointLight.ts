import { applyMixins } from "@lincode/utils"
import { PointLight as ThreePointLight, PointLightHelper } from "three"
import IPointLight, { pointLightDefaults } from "../../interface/IPointLight"
import LightBase from "../core/LightBase"
import PointLightMixin from "../core/mixins/PointLightMixin"

class PointLight extends LightBase<ThreePointLight> implements IPointLight {
    public static componentName = "pointLight"
    public static defaults = pointLightDefaults

    public constructor() {
        super(new ThreePointLight(), PointLightHelper)
    }
}
interface PointLight extends LightBase<ThreePointLight>, PointLightMixin<ThreePointLight> {}
applyMixins(PointLight, [PointLightMixin])
export default PointLight