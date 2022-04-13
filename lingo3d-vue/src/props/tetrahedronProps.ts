import { tetrahedronSchema, tetrahedronDefaults } from "lingo3d/lib/interface/ITetrahedron"

export default Object.fromEntries(
  Object.entries(tetrahedronSchema).map(([key, value]) => [key, { type: value, default: (tetrahedronDefaults as any)[key] }])
) as any as typeof tetrahedronSchema
