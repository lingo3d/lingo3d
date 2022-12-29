import store from "@lincode/reactivity"

type PhysX = {
    NativeArrayHelpers: any
    physics: any
    material: any
    shapeFlags: any
    pxRaycast?: (
        origin: any,
        direction: any,
        maxDistance: number,
        excludePtr?: number
    ) => any
    pxQuat: any
    pxVec: any
    pxVec_: any
    pxPose: any
    pxPose_: any
    pxFilterData: any
    pxControllerFilters: any
    scene: any
    getCooking: any
    getConvexFlags: any
    getInsertionCallback: any
    getPxControllerManager: any
    Vector_PxVec3: any
    Vector_PxReal: any
    Vector_PxU32: any
    Px: any
    PxConvexMeshDesc: any
    PxConvexMeshGeometry: any
    PxRigidActorExt: any
    PxRigidBodyExt: any
    PxCapsuleGeometry: any
    PxBoxGeometry: any
    PxBoundedData: any
    PxTriangleMeshDesc: any
    PxTriangleMeshGeometry: any
    PxCapsuleControllerDesc: any
    PxJointLimitCone: any
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
    PxArticulationJointTypeEnum: {
        ePRISMATIC: any
        eREVOLUTE: any
        eSPHERICAL: any
        eFIX: any
        eUNDEFINED: any
    }
    PxArticulationAxisEnum: {
        eTWIST: any
        eSWING1: any
        eSWING2: any
        eX: any
        eY: any
        eZ: any
        eCOUNT: any
    }
    PxArticulationMotionEnum: {
        eLOCKED: any
        eLIMITED: any
        eFREE: any
    }
    PxRigidBodyFlagEnum: {
        eKINEMATIC: any
        eUSE_KINEMATIC_TARGET_FOR_SCENE_QUERIES: any
        eENABLE_CCD: any
        eENABLE_CCD_FRICTION: any
        eENABLE_POSE_INTEGRATION_PREVIEW: any
        eENABLE_SPECULATIVE_CCD: any
        eENABLE_CCD_MAX_CONTACT_IMPULSE: any
        eRETAIN_ACCELERATIONS: any
    }
    PxSphericalJointFlagEnum: {
        eLIMIT_ENABLED: any
    }
    PxArticulationCacheFlagEnum: {
        eALL: any
        ePOSITION: any
    }
}

export const [setPhysX, getPhysX] = store<PhysX>({
    NativeArrayHelpers: undefined,
    physics: undefined,
    material: undefined,
    shapeFlags: undefined,
    pxRaycast: undefined,
    pxQuat: undefined,
    pxVec: undefined,
    pxVec_: undefined,
    pxPose: undefined,
    pxPose_: undefined,
    pxFilterData: undefined,
    pxControllerFilters: undefined,
    scene: undefined,
    getCooking: undefined,
    getConvexFlags: undefined,
    getInsertionCallback: undefined,
    getPxControllerManager: undefined,
    Vector_PxVec3: undefined,
    Vector_PxReal: undefined,
    Vector_PxU32: undefined,
    Px: undefined,
    PxConvexMeshDesc: undefined,
    PxConvexMeshGeometry: undefined,
    PxRigidActorExt: undefined,
    PxRigidBodyExt: undefined,
    PxCapsuleGeometry: undefined,
    PxBoxGeometry: undefined,
    PxBoundedData: undefined,
    PxTriangleMeshDesc: undefined,
    PxTriangleMeshGeometry: undefined,
    PxCapsuleControllerDesc: undefined,
    PxJointLimitCone: undefined,
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
    },
    PxArticulationJointTypeEnum: {
        ePRISMATIC: undefined,
        eREVOLUTE: undefined,
        eSPHERICAL: undefined,
        eFIX: undefined,
        eUNDEFINED: undefined
    },
    PxArticulationAxisEnum: {
        eTWIST: undefined,
        eSWING1: undefined,
        eSWING2: undefined,
        eX: undefined,
        eY: undefined,
        eZ: undefined,
        eCOUNT: undefined
    },
    PxArticulationMotionEnum: {
        eLOCKED: undefined,
        eLIMITED: undefined,
        eFREE: undefined
    },
    PxRigidBodyFlagEnum: {
        eKINEMATIC: undefined,
        eUSE_KINEMATIC_TARGET_FOR_SCENE_QUERIES: undefined,
        eENABLE_CCD: undefined,
        eENABLE_CCD_FRICTION: undefined,
        eENABLE_POSE_INTEGRATION_PREVIEW: undefined,
        eENABLE_SPECULATIVE_CCD: undefined,
        eENABLE_CCD_MAX_CONTACT_IMPULSE: undefined,
        eRETAIN_ACCELERATIONS: undefined
    },
    PxSphericalJointFlagEnum: {
        eLIMIT_ENABLED: undefined
    },
    PxArticulationCacheFlagEnum: {
        eALL: undefined,
        ePOSITION: undefined
    }
})
