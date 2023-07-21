import IDefaultSkyLight, {
    defaultSkyLightDefaults,
    defaultSkyLightSchema
} from "../../interface/IDefaultSkyLight"
import { getDefaultLight, setDefaultLight } from "../../states/useDefaultLight"
import SkyLight from "./SkyLight"
import throttleFrameTrailing from "../../throttle/utils/throttleFrameTrailing"
import { getSessionToken } from "../../states/useSessionToken"
import { createEffect } from "@lincode/reactivity"

let defaultSkyLight: DefaultSkyLight | undefined

const checkDefaultLight = throttleFrameTrailing(
    () => !defaultSkyLight && setDefaultLight(false)
)

export default class DefaultSkyLight
    extends SkyLight
    implements IDefaultSkyLight
{
    public static override componentName = "defaultSkyLight"
    public static override defaults = defaultSkyLightDefaults
    public static override schema = defaultSkyLightSchema

    public constructor() {
        super()
        this.x = 500
        this.y = 1000
        this.z = 1000
        defaultSkyLight?.dispose()
        defaultSkyLight = this
    }

    protected override disposeNode() {
        super.disposeNode()
        defaultSkyLight = undefined
        checkDefaultLight()
    }
}

createEffect(() => {
    getDefaultLight() ? new DefaultSkyLight() : defaultSkyLight?.dispose()
}, [getDefaultLight, getSessionToken])
