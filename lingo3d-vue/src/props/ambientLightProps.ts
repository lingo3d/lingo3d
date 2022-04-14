import { ambientLightSchema, ambientLightDefaults } from "lingo3d/lib/interface/IAmbientLight"

export default Object.fromEntries(
  Object.entries(ambientLightSchema).map(([key, value]) => [key, { type: value, default: (ambientLightDefaults as any)[key] }])
) as any as typeof ambientLightSchema
