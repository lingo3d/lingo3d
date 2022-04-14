import { groupSchema, groupDefaults } from "lingo3d/lib/interface/IGroup"

export default Object.fromEntries(
  Object.entries(groupSchema).map(([key, value]) => [key, { type: value, default: (groupDefaults as any)[key] }])
) as any as typeof groupSchema
