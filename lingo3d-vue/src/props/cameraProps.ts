import { cameraSchema, cameraDefaults } from "lingo3d/lib/interface/ICamera"

export default Object.fromEntries(
  Object.entries(cameraSchema).map(([key, value]) => [key, { type: value, default: (cameraDefaults as any)[key] }])
) as any as typeof cameraSchema
