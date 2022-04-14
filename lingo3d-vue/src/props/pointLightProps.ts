import { pointLightSchema, pointLightDefaults } from "lingo3d/lib/interface/IPointLight"

export default Object.fromEntries(
  Object.entries(pointLightSchema).map(([key, value]) => [key, { type: value, default: (pointLightDefaults as any)[key] }])
) as any as typeof pointLightSchema
