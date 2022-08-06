import EventLoopItem from "../api/core/EventLoopItem"
import ISky, { skyDefaults, skySchema } from "../interface/ISky"
import { setSkyShader } from "../states/useSkyShader"

export default class Sky extends EventLoopItem implements ISky {
    public static componentName = "sky"
    public static defaults = skyDefaults
    public static schema = skySchema

    public constructor() {
        super()
        setSkyShader(true)
    }
}
