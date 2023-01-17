import store from "@lincode/reactivity"
import fn from "../interface/utils/fn"

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
    pxVec__: any
    pxTransform: any
    pxTransform_: any
    pxTransform__: any
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
    PxSphereGeometry: any
    PxPlaneGeometry: any
    PxBoundedData: any
    PxTriangleMeshDesc: any
    PxTriangleMeshGeometry: any
    PxCapsuleControllerDesc: any
    PxJointLimitCone: any
    PxJointAngularLimitPair: any
    PxShapeExt: any
    PxCreateDynamic: any
    PxCapsuleClimbingModeEnum: {
        eEASY: () => any
        eCONSTRAINED: () => any
    }
    PxControllerBehaviorFlagEnum: {
        eCCT_CAN_RIDE_ON_OBJECT: () => any
        eCCT_SLIDE: () => any
        eCCT_USER_DEFINED_RIDE: () => any
    }
    PxControllerCollisionFlagEnum: {
        eCOLLISION_SIDES: () => any
        eCOLLISION_UP: () => any
        eCOLLISION_DOWN: () => any
    }
    PxControllerNonWalkableModeEnum: {
        ePREVENT_CLIMBING: () => any
        ePREVENT_CLIMBING_AND_FORCE_SLIDING: () => any
    }
    PxControllerShapeTypeEnum: {
        eBOX: () => any
        eCAPSULE: () => any
    }
    PxForceModeEnum: {
        eFORCE: () => any
        eIMPULSE: () => any
        eVELOCITY_CHANGE: () => any
        eACCELERATION: () => any
    }
    PxActorFlagEnum: {
        eDISABLE_GRAVITY: () => any
        eSEND_SLEEP_NOTIFIES: () => any
        eDISABLE_SIMULATION: () => any
        eVISUALIZATION: () => any
    }
    PxArticulationJointTypeEnum: {
        ePRISMATIC: () => any
        eREVOLUTE: () => any
        eSPHERICAL: () => any
        eFIX: () => any
        eUNDEFINED: () => any
    }
    PxArticulationAxisEnum: {
        eTWIST: () => any
        eSWING1: () => any
        eSWING2: () => any
        eX: () => any
        eY: () => any
        eZ: () => any
        eCOUNT: () => any
    }
    PxArticulationMotionEnum: {
        eLOCKED: () => any
        eLIMITED: () => any
        eFREE: () => any
    }
    PxRigidBodyFlagEnum: {
        eKINEMATIC: () => any
        eUSE_KINEMATIC_TARGET_FOR_SCENE_QUERIES: () => any
        eENABLE_CCD: () => any
        eENABLE_CCD_FRICTION: () => any
        eENABLE_POSE_INTEGRATION_PREVIEW: () => any
        eENABLE_SPECULATIVE_CCD: () => any
        eENABLE_CCD_MAX_CONTACT_IMPULSE: () => any
        eRETAIN_ACCELERATIONS: () => any
    }
    PxSphericalJointFlagEnum: {
        eLIMIT_ENABLED: () => any
    }
    PxArticulationCacheFlagEnum: {
        eALL: () => any
        ePOSITION: () => any
    }
    PxD6AxisEnum: {
        eX: () => any
        eY: () => any
        eZ: () => any
        eSWING1: () => any
        eSWING2: () => any
        eTWIST: () => any
        eCOUNT: () => any
    }
    PxD6MotionEnum: {
        eLOCKED: () => any
        eLIMITED: () => any
        eFREE: () => any
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
    pxVec__: undefined,
    pxTransform: undefined,
    pxTransform_: undefined,
    pxTransform__: undefined,
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
    PxSphereGeometry: undefined,
    PxPlaneGeometry: undefined,
    PxBoundedData: undefined,
    PxTriangleMeshDesc: undefined,
    PxTriangleMeshGeometry: undefined,
    PxCapsuleControllerDesc: undefined,
    PxJointLimitCone: undefined,
    PxJointAngularLimitPair: undefined,
    PxShapeExt: undefined,
    PxCreateDynamic: undefined,
    PxCapsuleClimbingModeEnum: {
        eEASY: fn,
        eCONSTRAINED: fn
    },
    PxControllerBehaviorFlagEnum: {
        eCCT_CAN_RIDE_ON_OBJECT: fn,
        eCCT_SLIDE: fn,
        eCCT_USER_DEFINED_RIDE: fn
    },
    PxControllerCollisionFlagEnum: {
        eCOLLISION_SIDES: fn,
        eCOLLISION_UP: fn,
        eCOLLISION_DOWN: fn
    },
    PxControllerNonWalkableModeEnum: {
        ePREVENT_CLIMBING: fn,
        ePREVENT_CLIMBING_AND_FORCE_SLIDING: fn
    },
    PxControllerShapeTypeEnum: {
        eBOX: fn,
        eCAPSULE: fn
    },
    PxForceModeEnum: {
        eFORCE: fn,
        eIMPULSE: fn,
        eVELOCITY_CHANGE: fn,
        eACCELERATION: fn
    },
    PxActorFlagEnum: {
        eDISABLE_GRAVITY: fn,
        eSEND_SLEEP_NOTIFIES: fn,
        eDISABLE_SIMULATION: fn,
        eVISUALIZATION: fn
    },
    PxArticulationJointTypeEnum: {
        ePRISMATIC: fn,
        eREVOLUTE: fn,
        eSPHERICAL: fn,
        eFIX: fn,
        eUNDEFINED: fn
    },
    PxArticulationAxisEnum: {
        eTWIST: fn,
        eSWING1: fn,
        eSWING2: fn,
        eX: fn,
        eY: fn,
        eZ: fn,
        eCOUNT: fn
    },
    PxArticulationMotionEnum: {
        eLOCKED: fn,
        eLIMITED: fn,
        eFREE: fn
    },
    PxRigidBodyFlagEnum: {
        eKINEMATIC: fn,
        eUSE_KINEMATIC_TARGET_FOR_SCENE_QUERIES: fn,
        eENABLE_CCD: fn,
        eENABLE_CCD_FRICTION: fn,
        eENABLE_POSE_INTEGRATION_PREVIEW: fn,
        eENABLE_SPECULATIVE_CCD: fn,
        eENABLE_CCD_MAX_CONTACT_IMPULSE: fn,
        eRETAIN_ACCELERATIONS: fn
    },
    PxSphericalJointFlagEnum: {
        eLIMIT_ENABLED: fn
    },
    PxArticulationCacheFlagEnum: {
        eALL: fn,
        ePOSITION: fn
    },
    PxD6AxisEnum: {
        eX: fn,
        eY: fn,
        eZ: fn,
        eSWING1: fn,
        eSWING2: fn,
        eTWIST: fn,
        eCOUNT: fn
    },
    PxD6MotionEnum: {
        eLOCKED: fn,
        eLIMITED: fn,
        eFREE: fn
    }
})

export const physXPtr = [getPhysX()]
getPhysX((val) => (physXPtr[0] = val))
