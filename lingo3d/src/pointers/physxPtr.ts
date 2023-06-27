type PhysX = {
    destroy: (target: any) => void
    controllerHitCallback: any
    NativeArrayHelpers: any
    physics: any
    material: any
    shapeFlags: any
    pxRaycast: (
        origin: any,
        direction: any,
        maxDistance: number,
        excludePtr?: number
    ) => any
    pxOverlap: (shape: any, transform: any) => Array<any>
    pxSweep: (
        shape: any,
        transform: any,
        direction: any,
        distance: number
    ) => Array<any>
    pxQuat: any
    pxVec: any
    pxVec_: any
    pxVec__: any
    pxExtendedVec: any
    pxTransform: any
    pxTransform_: any
    pxTransform__: any
    pxFilterData: any
    pxControllerFilters: any
    pxScene: any
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
    PxJointLinearLimit: any
    PxJointLinearLimitPair: any
    PxShapeExt: any
    PxD6Drive: any
    PxD6JointDrive: any
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
    PxPrismaticJointFlagEnum: {
        eLIMIT_ENABLED: () => any
    }
    PxRevoluteJointFlagEnum: {
        eLIMIT_ENABLED: () => any
        eDRIVE_ENABLED: () => any
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
    PxD6DriveEnum: {
        eX: () => any
        eY: () => any
        eZ: () => any
        eSWING: () => any
        eTWIST: () => any
        eSLERP: () => any
    }
}

export const physxPtr: [PhysX] = [{} as any]
