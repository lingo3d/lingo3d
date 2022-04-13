import { torusSchema, torusDefaults } from "lingo3d/lib/interface/ITorus"

export default Object.fromEntries(
  Object.entries(torusSchema).map(([key, value]) => [key, { type: value, default: (torusDefaults as any)[key] }])
) as any as typeof torusSchema
