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
    controllerManager: any
    pxControllerFilters: any
    PxCapsuleControllerDesc: any
    PxCapsuleClimbingModeEnum: {
        eEASY: any
        eCONSTRAINED: any
    }
    PxControllerBehaviorFlagEnum: {
        eCCT_CAN_RIDE_ON_OBJECT: any
        eCCT_SLIDE: any
        eCCT_USER_DEFINED_RIDE: any
    }
    PxControllerCollisionFlagEnum: {
        eCOLLISION_SIDES: any
        eCOLLISION_UP: any
        eCOLLISION_DOWN: any
    }
    PxControllerNonWalkableModeEnum: {
        ePREVENT_CLIMBING: any
        ePREVENT_CLIMBING_AND_FORCE_SLIDING: any
    }
    PxControllerShapeTypeEnum: {
        eBOX: any
        eCAPSULE: any
    }
    PxForceModeEnum: {
        eFORCE: any
        eIMPULSE: any
        eVELOCITY_CHANGE: any
        eACCELERATION: any
    }
    PxActorFlagEnum: {
        eDISABLE_GRAVITY: any
        eSEND_SLEEP_NOTIFIES: any
        eDISABLE_SIMULATION: any
        eVISUALIZATION: any
    }
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
    pxQuat: undefined,
    controllerManager: undefined,
    pxControllerFilters: undefined,
    PxCapsuleControllerDesc: undefined,
    PxCapsuleClimbingModeEnum: {
        eEASY: undefined,
        eCONSTRAINED: undefined
    },
    PxControllerBehaviorFlagEnum: {
        eCCT_CAN_RIDE_ON_OBJECT: undefined,
        eCCT_SLIDE: undefined,
        eCCT_USER_DEFINED_RIDE: undefined
    },
    PxControllerCollisionFlagEnum: {
        eCOLLISION_SIDES: undefined,
        eCOLLISION_UP: undefined,
        eCOLLISION_DOWN: undefined
    },
    PxControllerNonWalkableModeEnum: {
        ePREVENT_CLIMBING: undefined,
        ePREVENT_CLIMBING_AND_FORCE_SLIDING: undefined
    },
    PxControllerShapeTypeEnum: {
        eBOX: undefined,
        eCAPSULE: undefined
    },
    PxForceModeEnum: {
        eFORCE: undefined,
        eIMPULSE: undefined,
        eVELOCITY_CHANGE: undefined,
        eACCELERATION: undefined
    },
    PxActorFlagEnum: {
        eDISABLE_GRAVITY: undefined,
        eSEND_SLEEP_NOTIFIES: undefined,
        eDISABLE_SIMULATION: undefined,
        eVISUALIZATION: undefined
    }
})
