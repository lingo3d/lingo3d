import { sphereSchema, sphereDefaults } from "lingo3d/lib/interface/ISphere"

export default Object.fromEntries(
  Object.entries(sphereSchema).map(([key, value]) => [key, { type: value, default: (sphereDefaults as any)[key] }])
) as any as typeof sphereSchema
