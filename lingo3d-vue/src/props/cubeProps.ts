import { cubeSchema, cubeDefaults } from "lingo3d/lib/interface/ICube"

export default Object.fromEntries(
  Object.entries(cubeSchema).map(([key, value]) => [key, { type: value, default: (cubeDefaults as any)[key] }])
) as any as typeof cubeSchema
