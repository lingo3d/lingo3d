import { lazy } from "@lincode/utils"
import { BufferGeometry } from "three"

export default [
    lazy(() =>
        Promise.resolve({
            generate: async (geom: BufferGeometry) => {
                const { MeshBVH } = await import("three-mesh-bvh")
                return new MeshBVH(geom)
            }
        })
    )
]
