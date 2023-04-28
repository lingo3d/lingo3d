import { PointLight as ThreePointLight } from "three"
import IPointLight, {
    pointLightDefaults,
    pointLightSchema
} from "../../interface/IPointLight"
import PointLightBase from "../core/PointLightBase"
import {
    addPointLightShadowResolutionSystem,
    deletePointLightShadowResolutionSystem
} from "../../systems/pointLightShadowResolutionSystem"

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

    protected override disposeNode() {
        super.disposeNode()
        deletePointLightShadowResolutionSystem(this)
    }

    public override get castShadow() {
        return super.castShadow
    }
    public override set castShadow(val) {
        super.castShadow = val
        val
            ? addPointLightShadowResolutionSystem(this, { step: undefined })
            : deletePointLightShadowResolutionSystem(this)
    }
}
