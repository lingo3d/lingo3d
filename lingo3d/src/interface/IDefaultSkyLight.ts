import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import ISkyLight, { skyLightDefaults, skyLightSchema } from "./ISkyLight"
import { FAR } from "../globals"

export default interface IDefaultSkyLight extends ISkyLight {}

export const defaultSkyLightSchema: Required<ExtractProps<IDefaultSkyLight>> = {
    ...skyLightSchema
}

export const defaultSkyLightDefaults = extendDefaults<IDefaultSkyLight>(
    [skyLightDefaults],
    { y: FAR, z: FAR, intensity: 0.5, castShadow: true }
)
