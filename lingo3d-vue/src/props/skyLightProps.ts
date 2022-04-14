import { skyLightSchema, skyLightDefaults } from "lingo3d/lib/interface/ISkyLight"

export default Object.fromEntries(
  Object.entries(skyLightSchema).map(([key, value]) => [key, { type: value, default: (skyLightDefaults as any)[key] }])
) as any as typeof skyLightSchema
