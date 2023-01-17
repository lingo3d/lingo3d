import { physXPtr } from "../../../../states/usePhysX"
import {
    decreasePhysXCookingCount,
    increasePhysXCookingCount
} from "../../../../states/usePhysXCookingCount"
import destroy from "./destroy"
import computePxVertices from "./computePxVertices"
import MeshAppendable from "../../../../api/core/MeshAppendable"
import createInstancePool from "../../utils/createInstancePool"
import getActualScale from "../../../utils/getActualScale"
import Loaded from "../../Loaded"
import Primitive from "../../Primitive"

type Params = [typeSrc: string, scaleX: number, scaleY: number, scaleZ: number]

const [increaseCount, decreaseCount, allocateDefaultConvexGeometryInstance] =
    createInstancePool<any, Params>((_, params, manager) => {
        const {
            getConvexFlags,
            getCooking,
            getInsertionCallback,
            PxConvexMeshDesc,
            PxConvexMeshGeometry,
            PxSphereGeometry,
            PxBoxGeometry,
            physics,
            material,
            shapeFlags,
            pxFilterData
        } = physXPtr[0]

        const [typeSrc, x, y, z] = params
        if (
            !manager ||
            ((typeSrc === "cube" || typeSrc === "sphere") && x === y && x === z)
        ) {
            const pxGeometry: any =
                typeSrc === "sphere"
                    ? new PxSphereGeometry(x)
                    : new PxBoxGeometry(x, y, z)
            const shape = physics.createShape(
                pxGeometry,
                material,
                true,
                shapeFlags
            )
            shape.setSimulationFilterData(pxFilterData)
            destroy(pxGeometry)
            return shape
        }

        increasePhysXCookingCount()

        const [vec3Vector, count] = computePxVertices(
            "loadedObject3d" in manager
                ? manager.loadedObject3d!
                : manager.object3d,
            manager
        )
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

        decreasePhysXCookingCount()

        return pxGeometry
    }, destroy)

export { allocateDefaultConvexGeometryInstance }

export default (typeSrc: string, manager: Primitive | Loaded<any>) => {
    const { x, y, z } = getActualScale(manager)
    const params: Params = [typeSrc, x, y, z]
    const paramString = JSON.stringify(params)
    decreaseConvexGeometryCount(manager)
    return increaseCount(
        MeshAppendable,
        params,
        (manager.convexParamString = paramString),
        manager
    )
}

export const decreaseConvexGeometryCount = (manager: Primitive | Loaded<any>) =>
    manager.convexParamString &&
    decreaseCount(MeshAppendable, manager.convexParamString)
