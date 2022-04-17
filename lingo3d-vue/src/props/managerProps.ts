import { objectManagerSchema, objectManagerDefaults } from "lingo3d/lib/interface/IObjectManager"

export default Object.fromEntries(Object.entries(objectManagerSchema)
  .map(([key, value]) => [key, { type: value, default: (objectManagerDefaults as any)[key] }])) as any as typeof objectManagerSchema