import { AmbientLight as ThreeAmbientLight } from "three"
import LightBase from "../core/LightBase"
import IAmbientLight, {
    ambientLightDefaults,
    ambientLightSchema
} from "../../interface/IAmbientLight"

export default class AmbientLight
    extends LightBase<typeof ThreeAmbientLight>
    implements IAmbientLight
{
    public static componentName = "ambientLight"
    public static defaults = ambientLightDefaults
    public static schema = ambientLightSchema

    public constructor() {
        super(ThreeAmbientLight)
    }
}
