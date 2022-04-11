import { modelSchema, modelDefaults } from "lingo3d/lib/interface/IModel"

export default Object.fromEntries(Object.entries(modelSchema)
  .map(([key, value]) => [key, { type: value, default: (modelDefaults as any)[key] }])) as any as typeof modelSchema