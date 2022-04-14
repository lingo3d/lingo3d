import { svgMeshSchema, svgMeshDefaults } from "lingo3d/lib/interface/ISvgMesh"

export default Object.fromEntries(
  Object.entries(svgMeshSchema).map(([key, value]) => [key, { type: value, default: (svgMeshDefaults as any)[key] }])
) as any as typeof svgMeshSchema
