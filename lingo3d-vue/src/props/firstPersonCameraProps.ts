import { characterCameraSchema, characterCameraDefaults } from "lingo3d/lib/interface/IcharacterCamera"

export default Object.fromEntries(
  Object.entries(characterCameraSchema).map(([key, value]) => [key, { type: value, default: (characterCameraDefaults as any)[key] }])
) as any as typeof characterCameraSchema
