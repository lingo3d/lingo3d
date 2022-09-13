import store, { push, pull } from "@lincode/reactivity"
import { MeshBVH } from "three-mesh-bvh"

const [setBVHMap, getBVHMap] = store<Array<MeshBVH>>([])
const pushBVHMap = push(setBVHMap, getBVHMap)
const pullBVHMap = pull(setBVHMap, getBVHMap)

export { pushBVHMap, pullBVHMap, getBVHMap }
