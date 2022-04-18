import { soundSchema, soundDefaults } from "lingo3d/lib/interface/ISound"

export default Object.fromEntries(
  Object.entries(soundSchema).map(([key, value]) => [key, { type: value, default: (soundDefaults as any)[key] }])
) as any as typeof soundSchema
