import store from "@lincode/reactivity"

type PhysX = {
    physics: any
    material: any
    shapeFlags: any
    pxVec: any
    pxPose: any
    pxFilterData: any
    scene: any
    cooking: any
    convexFlags: any
    insertionCallback: any
    Vector_PxVec3: any
    PxConvexMeshDesc: any
    PxConvexMeshGeometry: any
    PxRigidActorExt: any
    PxCapsuleGeometry: any
    PxBoxGeometry: any
    PxBoundedData: any
    Vector_PxU32: any
    PxTriangleMeshDesc: any
    PxTriangleMeshGeometry: any
    pxQuat: any
}

export const [setPhysX, getPhysX] = store<PhysX>({
    physics: undefined,
    material: undefined,
    shapeFlags: undefined,
    pxVec: undefined,
    pxPose: undefined,
    pxFilterData: undefined,
    scene: undefined,
    cooking: undefined,
    convexFlags: undefined,
    insertionCallback: undefined,
    Vector_PxVec3: undefined,
    PxConvexMeshDesc: undefined,
    PxConvexMeshGeometry: undefined,
    PxRigidActorExt: undefined,
    PxCapsuleGeometry: undefined,
    PxBoxGeometry: undefined,
    PxBoundedData: undefined,
    Vector_PxU32: undefined,
    PxTriangleMeshDesc: undefined,
    PxTriangleMeshGeometry: undefined,
    pxQuat: undefined
})
