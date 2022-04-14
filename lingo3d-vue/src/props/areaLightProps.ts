import { areaLightSchema, areaLightDefaults } from "lingo3d/lib/interface/IAreaLight"

export default Object.fromEntries(
  Object.entries(areaLightSchema).map(([key, value]) => [key, { type: value, default: (areaLightDefaults as any)[key] }])
) as any as typeof areaLightSchema
