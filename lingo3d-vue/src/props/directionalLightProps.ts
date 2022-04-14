import { directinalLightSchema, directionalLightDefaults } from "lingo3d/lib/interface/IDirectionalLight"

export default Object.fromEntries(
  Object.entries(directinalLightSchema).map(([key, value]) => [key, { type: value, default: (directionalLightDefaults as any)[key] }])
) as any as typeof directinalLightSchema
