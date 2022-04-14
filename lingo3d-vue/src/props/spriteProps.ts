import { spriteSchema, spriteDefaults } from "lingo3d/lib/interface/ISprite"

export default Object.fromEntries(
  Object.entries(spriteSchema).map(([key, value]) => [key, { type: value, default: (spriteDefaults as any)[key] }])
) as any as typeof spriteSchema
