import MeshAppendable from "../display/core/MeshAppendable"
import Loaded from "../display/core/Loaded"
import PhysicsObjectManager from "../display/core/PhysicsObjectManager"
import computePxVertices from "../engine/physx/computePxVertices"
import { physxPtr } from "../pointers/physxPtr"
import createSharedPool from "./utils/createSharedPool"
import { busyCountPtr } from "../pointers/busyCountPtr"

type PhysxConvexGeometryParams = [
    typeSrc: string,
    scaleX: number,
    scaleY: number,
    scaleZ: number
]

export const [requestPhysxConvexGeometry, releasePhysxConvexGeometry] =
    createSharedPool<
        PhysicsObjectManager,
        PhysxConvexGeometryParams,
        MeshAppendable | Loaded
    >(
        (params, manager) => {
            const {
                getConvexFlags,
                getCooking,
                getInsertionCallback,
                PxConvexMeshDesc,
                PxConvexMeshGeometry,
                PxSphereGeometry,
                PxBoxGeometry,
                destroy
            } = physxPtr[0]

            const [typeSrc, x, y, z] = params
            if (typeSrc === "cube")
                return new PxBoxGeometry(x * 0.5, y * 0.5, z * 0.5)
            if (typeSrc === "sphere" && x === y && x === z)
                return new PxSphereGeometry(x * 0.5)

            busyCountPtr[0]++
            const [vec3Vector, count] = computePxVertices(manager)
            const desc = new PxConvexMeshDesc()
            desc.flags = getConvexFlags()
            desc.points.count = count
            desc.points.stride = 12
            desc.points.data = vec3Vector.data()

            const convexMesh = getCooking().createConvexMesh(
                desc,
                getInsertionCallback()
            )
            const pxGeometry = new PxConvexMeshGeometry(convexMesh)

            destroy(desc)
            vec3Vector.clear()
            destroy(vec3Vector)
            busyCountPtr[0]--

            return pxGeometry
        },
        (target) => physxPtr[0].destroy(target)
    )
