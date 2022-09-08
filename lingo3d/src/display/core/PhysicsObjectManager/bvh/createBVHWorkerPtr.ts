import { lazy } from "@lincode/utils"
import { BufferGeometry } from "three"

export default [
    lazy(async () => {
        const { MeshBVH } = await import("three-mesh-bvh")
        return {
            generate: (geom: BufferGeometry) =>
                Promise.resolve(new MeshBVH(geom))
        }
    })
]
