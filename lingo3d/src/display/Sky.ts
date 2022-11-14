import Appendable from "../api/core/Appendable"
import ISky, { skyDefaults, skySchema } from "../interface/ISky"
import { setSkyShader } from "../states/useSkyShader"

export default class Sky extends Appendable implements ISky {
    public static componentName = "sky"
    public static defaults = skyDefaults
    public static schema = skySchema

    public constructor() {
        super()
        setSkyShader(true)
    }
}
