import { mouseSchema, mouseDefaults } from "lingo3d/lib/interface/IMouse"

export default Object.fromEntries(
  Object.entries(mouseSchema).map(([key, value]) => [key, { type: value, default: (mouseDefaults as any)[key] }])
) as any as typeof mouseSchema
