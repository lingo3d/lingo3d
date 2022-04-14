import { orbitCameraSchema, orbitCameraDefaults } from "lingo3d/lib/interface/IOrbitCamera"

export default Object.fromEntries(
  Object.entries(orbitCameraSchema).map(([key, value]) => [key, { type: value, default: (orbitCameraDefaults as any)[key] }])
) as any as typeof orbitCameraSchema
