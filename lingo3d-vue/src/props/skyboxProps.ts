import { skyboxSchema, skyboxDefaults } from "lingo3d/lib/interface/ISkybox"

export default Object.fromEntries(Object.entries(skyboxSchema)
  .map(([key, value]) => [key, { type: value, default: (skyboxDefaults as any)[key] }])) as any as typeof skyboxSchema