import { circleSchema, circleDefaults } from "lingo3d/lib/interface/ICircle"

export default Object.fromEntries(
  Object.entries(circleSchema).map(([key, value]) => [key, { type: value, default: (circleDefaults as any)[key] }])
) as any as typeof circleSchema
