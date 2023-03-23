import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import ISkyLight, { skyLightDefaults, skyLightSchema } from "./ISkyLight"

export default interface IDefaultSkyLight extends ISkyLight {}

export const defaultSkyLightSchema: Required<ExtractProps<IDefaultSkyLight>> = {
    ...skyLightSchema
}

export const defaultSkyLightDefaults = extendDefaults<IDefaultSkyLight>(
    [skyLightDefaults],
    { x: 500, y: 1000, z: 1000 }
)
