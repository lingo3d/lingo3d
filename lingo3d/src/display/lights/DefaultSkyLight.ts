import { debounceTrailing } from "@lincode/utils"
import { FAR } from "../../globals"
import IDefaultSkyLight, {
    defaultSkyLightDefaults,
    defaultSkyLightSchema
} from "../../interface/IDefaultSkyLight"
import { getDefaultLight, setDefaultLight } from "../../states/useDefaultLight"
import SkyLight from "./SkyLight"

let defaultSkyLight: DefaultSkyLight | undefined

const checkDefaultLight = debounceTrailing(() => {
    if (!defaultSkyLight) setDefaultLight(false)
})

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
    }

    protected override _dispose() {
        super._dispose()
        defaultSkyLight = undefined
        checkDefaultLight()
    }
}

getDefaultLight((val) =>
    val ? new DefaultSkyLight() : defaultSkyLight?.dispose()
)
