import { createEffect } from "@lincode/reactivity"
import { FAR } from "../../globals"
import IDefaultSkyLight, {
    defaultSkyLightDefaults,
    defaultSkyLightSchema
} from "../../interface/IDefaultSkyLight"
import { getDefaultLight } from "../../states/useDefaultLight"
import SkyLight from "./SkyLight"

export const defaultSkyLightPtr: [DefaultSkyLight | undefined] = [undefined]

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
    }
}

createEffect(() => {
    const defaultLight = getDefaultLight()
    if (!defaultLight) return

    const light = new DefaultSkyLight()

    return () => {
        light.dispose()
    }
}, [getDefaultLight])
