import { primitiveSchema, primitiveDefaults } from "lingo3d/lib/interface/IPrimitive"

export default Object.fromEntries(Object.entries(primitiveSchema)
  .map(([key, value]) => [key, { type: value, default: (primitiveDefaults as any)[key] }])) as any as typeof primitiveSchema