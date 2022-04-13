import { planeSchema, planeDefaults } from "lingo3d/lib/interface/IPlane"

export default Object.fromEntries(
  Object.entries(planeSchema).map(([key, value]) => [key, { type: value, default: (planeDefaults as any)[key] }])
) as any as typeof planeSchema
