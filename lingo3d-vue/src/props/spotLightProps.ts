import { spotLightSchema, spotLightDefaults } from "lingo3d/lib/interface/ISpotLight"

export default Object.fromEntries(
  Object.entries(spotLightSchema).map(([key, value]) => [key, { type: value, default: (spotLightDefaults as any)[key] }])
) as any as typeof spotLightSchema
