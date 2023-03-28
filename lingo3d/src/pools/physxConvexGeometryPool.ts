import PhysicsObjectManager from "../display/core/PhysicsObjectManager"
import computePxVertices from "../display/core/PhysicsObjectManager/physx/computePxVertices"
import destroy from "../display/core/PhysicsObjectManager/physx/destroy"
import { physxPtr } from "../display/core/PhysicsObjectManager/physx/physxPtr"
import createInstancePool from "../display/core/utils/createInstancePool"

export type PhysxConvexGeometryParams = [
    typeSrc: string,
    scaleX: number,
    scaleY: number,
    scaleZ: number
]

export const [increasePhysxConvexGeometry, decreasePhysxConvexGeometry] =
    createInstancePool<PhysicsObjectManager, PhysxConvexGeometryParams>(
        (_, params, manager) => {
            const {
                getConvexFlags,
                getCooking,
                getInsertionCallback,
                PxConvexMeshDesc,
                PxConvexMeshGeometry,
                PxSphereGeometry,
                PxBoxGeometry
            } = physxPtr[0]

            const [typeSrc, x, y, z] = params
            if (!manager || typeSrc === "cube")
                return new PxBoxGeometry(x * 0.5, y * 0.5, z * 0.5)
            if (typeSrc === "sphere" && x === y && x === z)
                return new PxSphereGeometry(x * 0.5)

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

            return pxGeometry
        },
        destroy
    )