import { DirectionalLight as ThreeDirectionalLight } from "three"
import scene from "../../engine/scene"
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

    public constructor() {
        super(new ThreeDirectionalLight())
        scene.add(this.$innerObject.target)
    }

    public override disposeNode() {
        super.disposeNode()
        scene.remove(this.$innerObject.target)
    }
}
