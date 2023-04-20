import { PointLight as ThreePointLight } from "three"
import IPointLight, {
    pointLightDefaults,
    pointLightSchema
} from "../../interface/IPointLight"
import {
    addPointLightShadowResolutionSystem,
    deletePointLightShadowResolutionSystem
} from "../../systems/pointLightShadowResolutionSystem"
import PointLightBase from "../core/PointLightBase"

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

    protected addShadowResolutionSystem = addPointLightShadowResolutionSystem
    protected deleteShadowResolutionSystem =
        deletePointLightShadowResolutionSystem
}
