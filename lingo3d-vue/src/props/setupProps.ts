import { setupSchema, setupDefaults } from "lingo3d/lib/interface/ISetup"

export default Object.fromEntries(
  Object.entries(setupSchema).map(([key, value]) => [key, { type: value, default: (setupDefaults as any)[key] }])
) as any as typeof setupSchema