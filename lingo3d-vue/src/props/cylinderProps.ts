import { cylinderSchema, cylinderDefaults } from "lingo3d/lib/interface/ICylinder"

export default Object.fromEntries(
  Object.entries(cylinderSchema).map(([key, value]) => [key, { type: value, default: (cylinderDefaults as any)[key] }])
) as any as typeof cylinderSchema
