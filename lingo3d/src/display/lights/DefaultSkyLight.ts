import { FAR } from "../../globals"
import IDefaultSkyLight, {
    defaultSkyLightDefaults,
    defaultSkyLightSchema
} from "../../interface/IDefaultSkyLight"
import { setDefaultLight, getDefaultLight } from "../../states/useDefaultLight"
import SkyLight from "./SkyLight"

let defaultSkyLight: DefaultSkyLight | undefined

export default class DefaultSkyLight
    extends SkyLight
    implements IDefaultSkyLight
{
    public static override componentName = "defaultSkyLight"
    public static override defaults = defaultSkyLightDefaults
    public static override schema = defaultSkyLightSchema

    public constructor() {
        super()
        this.y = FAR
        this.z = FAR
        this.intensity = 0.5
        defaultSkyLight?.dispose()
        defaultSkyLight = this
        setDefaultLight(true)
    }

    protected override _dispose() {
        super._dispose()
        defaultSkyLight = undefined
        setDefaultLight(false)
    }
}

getDefaultLight((val) => {
    if (val) new DefaultSkyLight()
    else defaultSkyLight?.dispose()
})
