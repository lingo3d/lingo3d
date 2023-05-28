import { PointLight as ThreePointLight } from "three"
import IPointLight, {
    pointLightDefaults,
    pointLightSchema
} from "../../interface/IPointLight"
import PointLightBase from "../core/PointLightBase"
import { pointLightShadowResolutionSystem } from "../../systems/pointLightShadowResolutionSystem"

export default class PointLight
    extends PointLightBase<ThreePointLight>
    implements IPointLight
{
    public static componentName = "pointLight"
    public static defaults = pointLightDefaults
    public static schema = pointLightSchema

    public constructor() {
        super(new ThreePointLight())
    }

    public override get shadows() {
        return super.shadows
    }
    public override set shadows(val) {
        super.shadows = val
        val
            ? pointLightShadowResolutionSystem.add(this)
            : pointLightShadowResolutionSystem.delete(this)
    }
}
