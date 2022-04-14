import { sceneSchema, sceneDefaults } from "lingo3d/lib/interface/IScene"

export default Object.fromEntries(
  Object.entries(sceneSchema).map(([key, value]) => [key, { type: value, default: (sceneDefaults as any)[key] }])
) as any as typeof sceneSchema
