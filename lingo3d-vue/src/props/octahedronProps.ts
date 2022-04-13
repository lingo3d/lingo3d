import { octahedronSchema, octahedronDefaults } from "lingo3d/lib/interface/IOctahedron"

export default Object.fromEntries(
  Object.entries(octahedronSchema).map(([key, value]) => [key, { type: value, default: (octahedronDefaults as any)[key] }])
) as any as typeof octahedronSchema
