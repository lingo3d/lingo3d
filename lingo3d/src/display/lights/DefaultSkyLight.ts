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
        defaultSkyLight?.dispose()
        defaultSkyLight = this
        setDefaultLight(true)
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        defaultSkyLight = undefined
        setDefaultLight(false)
        return this
    }
}

getDefaultLight((val) => {
    if (val) new DefaultSkyLight()
    else defaultSkyLight?.dispose()
})
