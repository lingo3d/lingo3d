import { reflectorSchema, reflectorDefaults } from "lingo3d/lib/interface/IReflector"

export default Object.fromEntries(
  Object.entries(reflectorSchema).map(([key, value]) => [key, { type: value, default: (reflectorDefaults as any)[key] }])
) as any as typeof reflectorSchema
