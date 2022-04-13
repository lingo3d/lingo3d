import { coneSchema, coneDefaults } from "lingo3d/lib/interface/ICone"

export default Object.fromEntries(
  Object.entries(coneSchema).map(([key, value]) => [key, { type: value, default: (coneDefaults as any)[key] }])
) as any as typeof coneSchema
