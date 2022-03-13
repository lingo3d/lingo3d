import store from "@lincode/reactivity"
import { Mesh } from "three"
import type { MeshBVH } from "three-mesh-bvh"

export const [setBVH, getBVH] = store<[MeshBVH, Mesh] | undefined>(undefined)