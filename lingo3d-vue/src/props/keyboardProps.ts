import { keyboardSchema, keyboardDefaults } from "lingo3d/lib/interface/IKeyboard"

export default Object.fromEntries(
  Object.entries(keyboardSchema).map(([key, value]) => [key, { type: value, default: (keyboardDefaults as any)[key] }])
) as any as typeof keyboardSchema
