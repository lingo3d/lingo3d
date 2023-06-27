import { forceGetInstance, lazy } from "@lincode/utils"
import { setPhysXLoaded } from "../../states/usePhysXLoaded"
import { physxPtr } from "../../pointers/physxPtr"
import { simd } from "wasm-feature-detect"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { getGravity } from "../../states/useGravity"
import {
    actorPtrManagerMap,
    controllerManagerContactMap,
    controllerManagerMap,
    managerContactMap
} from "../../collections/pxCollections"
import "./physxLoop"
import { clearCollectionEffectSystem } from "../../systems/configSystems/clearCollectionEffectSystem"
;(async () => {
    const simdSupported = await simd()

    const { default: physx } = await (simdSupported
        ? import("./physxSimd")
        : import("./physx"))
    const PhysX = await physx()

    const {
        destroy,
        wrapPointer,
        NativeArrayHelpers,
        Vector_PxVec3,
        Vector_PxReal,
        Vector_PxU32,
        Vector_PxContactPairPoint,
        PxTopLevelFunctions,
        PxDefaultAllocator,
        PxDefaultErrorCallback,
        PxTolerancesScale,
        PxCookingParams,
        PxConvexFlags,
        PxVec3,
        PxExtendedVec3,
        PxSceneDesc,
        PxShapeFlags,
        PxTransform,
        PxFilterData,
        PxBoxGeometry,
        PxCapsuleGeometry,
        PxSphereGeometry,
        PxPlaneGeometry,
        PxConvexMeshDesc,
        PxConvexMeshGeometry,
        PxRigidActorExt,
        PxRigidBodyExt,
        PxBoundedData,
        PxTriangleMeshDesc,
        PxTriangleMeshGeometry,
        PxQuat,
        PxCapsuleControllerDesc,
        PxControllerFilters,
        PxRaycastBuffer10,
        PxOverlapBuffer10,
        PxSweepBuffer10,
        PxJointLimitCone,
        PxJointAngularLimitPair,
        PxJointLinearLimit,
        PxJointLinearLimitPair,
        PxShapeExt,
        PxD6Drive,
        PxD6JointDrive,
        PxSimulationEventCallbackImpl,
        PxUserControllerHitReportImpl,
        PxMeshPreprocessingFlags,
        PxContactPair,
        PxContactPairHeader,
        PxControllerShapeHit,
        PxQueryFilterData,
        PxInsertionCallback,

        _emscripten_enum_PxMeshPreprocessingFlagEnum_eDISABLE_CLEAN_MESH,
        _emscripten_enum_PxMeshPreprocessingFlagEnum_eDISABLE_ACTIVE_EDGES_PRECOMPUTE,

        _emscripten_enum_PxMeshCookingHintEnum_eCOOKING_PERFORMANCE,

        _emscripten_enum_PxConvexFlagEnum_eCOMPUTE_CONVEX,
        _emscripten_enum_PxConvexFlagEnum_eDISABLE_MESH_VALIDATION,
        _emscripten_enum_PxConvexFlagEnum_eFAST_INERTIA_COMPUTATION,

        _emscripten_enum_PxShapeFlagEnum_eSCENE_QUERY_SHAPE,
        _emscripten_enum_PxShapeFlagEnum_eSIMULATION_SHAPE,

        _emscripten_enum_PxIDENTITYEnum_PxIdentity,

        _emscripten_enum_PxCapsuleClimbingModeEnum_eEASY,
        _emscripten_enum_PxCapsuleClimbingModeEnum_eCONSTRAINED,

        _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_CAN_RIDE_ON_OBJECT,
        _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_SLIDE,
        _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_USER_DEFINED_RIDE,

        _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_SIDES,
        _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_UP,
        _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_DOWN,

        _emscripten_enum_PxControllerNonWalkableModeEnum_ePREVENT_CLIMBING,
        _emscripten_enum_PxControllerNonWalkableModeEnum_ePREVENT_CLIMBING_AND_FORCE_SLIDING,

        _emscripten_enum_PxControllerShapeTypeEnum_eBOX,
        _emscripten_enum_PxControllerShapeTypeEnum_eCAPSULE,

        _emscripten_enum_PxForceModeEnum_eFORCE,
        _emscripten_enum_PxForceModeEnum_eIMPULSE,
        _emscripten_enum_PxForceModeEnum_eVELOCITY_CHANGE,
        _emscripten_enum_PxForceModeEnum_eACCELERATION,

        _emscripten_enum_PxActorFlagEnum_eVISUALIZATION,
        _emscripten_enum_PxActorFlagEnum_eDISABLE_GRAVITY,
        _emscripten_enum_PxActorFlagEnum_eSEND_SLEEP_NOTIFIES,
        _emscripten_enum_PxActorFlagEnum_eDISABLE_SIMULATION,

        _emscripten_enum_PxPairFlagEnum_eNOTIFY_TOUCH_FOUND,
        _emscripten_enum_PxPairFlagEnum_eNOTIFY_TOUCH_LOST,
        _emscripten_enum_PxPairFlagEnum_eNOTIFY_CONTACT_POINTS,

        _emscripten_enum_PxPairFilteringModeEnum_eKEEP,
        _emscripten_enum_PxPairFilteringModeEnum_eKILL,
        _emscripten_enum_PxPairFilteringModeEnum_eDEFAULT,
        _emscripten_enum_PxPairFilteringModeEnum_eSUPPRESS,

        _emscripten_enum_PxArticulationFlagEnum_eFIX_BASE,
        _emscripten_enum_PxArticulationFlagEnum_eDRIVE_LIMITS_ARE_FORCES,
        _emscripten_enum_PxArticulationFlagEnum_eDISABLE_SELF_COLLISION,
        _emscripten_enum_PxArticulationFlagEnum_eCOMPUTE_JOINT_FORCES,

        _emscripten_enum_PxArticulationJointTypeEnum_ePRISMATIC,
        _emscripten_enum_PxArticulationJointTypeEnum_eREVOLUTE,
        _emscripten_enum_PxArticulationJointTypeEnum_eSPHERICAL,
        _emscripten_enum_PxArticulationJointTypeEnum_eFIX,
        _emscripten_enum_PxArticulationJointTypeEnum_eUNDEFINED,

        _emscripten_enum_PxArticulationAxisEnum_eTWIST,
        _emscripten_enum_PxArticulationAxisEnum_eSWING1,
        _emscripten_enum_PxArticulationAxisEnum_eSWING2,
        _emscripten_enum_PxArticulationAxisEnum_eX,
        _emscripten_enum_PxArticulationAxisEnum_eY,
        _emscripten_enum_PxArticulationAxisEnum_eZ,
        _emscripten_enum_PxArticulationAxisEnum_eCOUNT,

        _emscripten_enum_PxArticulationMotionEnum_eLOCKED,
        _emscripten_enum_PxArticulationMotionEnum_eLIMITED,
        _emscripten_enum_PxArticulationMotionEnum_eFREE,

        _emscripten_enum_PxRigidBodyFlagEnum_eKINEMATIC,
        _emscripten_enum_PxRigidBodyFlagEnum_eUSE_KINEMATIC_TARGET_FOR_SCENE_QUERIES,
        _emscripten_enum_PxRigidBodyFlagEnum_eENABLE_CCD,
        _emscripten_enum_PxRigidBodyFlagEnum_eENABLE_CCD_FRICTION,
        _emscripten_enum_PxRigidBodyFlagEnum_eENABLE_POSE_INTEGRATION_PREVIEW,
        _emscripten_enum_PxRigidBodyFlagEnum_eENABLE_SPECULATIVE_CCD,
        _emscripten_enum_PxRigidBodyFlagEnum_eENABLE_CCD_MAX_CONTACT_IMPULSE,
        _emscripten_enum_PxRigidBodyFlagEnum_eRETAIN_ACCELERATIONS,

        _emscripten_enum_PxSphericalJointFlagEnum_eLIMIT_ENABLED,
        _emscripten_enum_PxPrismaticJointFlagEnum_eLIMIT_ENABLED,
        _emscripten_enum_PxRevoluteJointFlagEnum_eLIMIT_ENABLED,
        _emscripten_enum_PxRevoluteJointFlagEnum_eDRIVE_ENABLED,

        _emscripten_enum_PxArticulationCacheFlagEnum_eALL,
        _emscripten_enum_PxArticulationCacheFlagEnum_ePOSITION,

        _emscripten_enum_PxGeometryTypeEnum_eBOX,
        _emscripten_enum_PxGeometryTypeEnum_eSPHERE,
        _emscripten_enum_PxGeometryTypeEnum_eCAPSULE,
        _emscripten_enum_PxGeometryTypeEnum_eCONVEXMESH,

        _emscripten_enum_PxD6AxisEnum_eX,
        _emscripten_enum_PxD6AxisEnum_eY,
        _emscripten_enum_PxD6AxisEnum_eZ,
        _emscripten_enum_PxD6AxisEnum_eTWIST,
        _emscripten_enum_PxD6AxisEnum_eSWING1,
        _emscripten_enum_PxD6AxisEnum_eSWING2,
        _emscripten_enum_PxD6AxisEnum_eCOUNT,

        _emscripten_enum_PxD6MotionEnum_eLOCKED,
        _emscripten_enum_PxD6MotionEnum_eLIMITED,
        _emscripten_enum_PxD6MotionEnum_eFREE,

        _emscripten_enum_PxD6DriveEnum_eX,
        _emscripten_enum_PxD6DriveEnum_eY,
        _emscripten_enum_PxD6DriveEnum_eZ,
        _emscripten_enum_PxD6DriveEnum_eSWING,
        _emscripten_enum_PxD6DriveEnum_eTWIST,
        _emscripten_enum_PxD6DriveEnum_eSLERP,

        _emscripten_enum_PxQueryFlagEnum_eDYNAMIC,
        _emscripten_enum_PxQueryFlagEnum_eSTATIC
    } = PhysX

    const Px = PxTopLevelFunctions.prototype

    // create PxFoundation
    const version = Px.PHYSICS_VERSION
    const allocator = new PxDefaultAllocator()
    const errorCb = new PxDefaultErrorCallback()
    const foundation = Px.CreateFoundation(version, allocator, errorCb)

    //create PxPhysics
    const scale = new PxTolerancesScale()
    const physics = Px.CreatePhysics(version, foundation, scale)

    //init extensions
    Px.InitExtensions(physics)

    //create PxCooking
    const getCooking = lazy(() => {
        const cookingParams = new PxCookingParams(scale)
        cookingParams.suppressTriangleMeshRemapTable = true
        cookingParams.meshPreprocessParams = new PxMeshPreprocessingFlags(
            _emscripten_enum_PxMeshPreprocessingFlagEnum_eDISABLE_CLEAN_MESH() |
                _emscripten_enum_PxMeshPreprocessingFlagEnum_eDISABLE_ACTIVE_EDGES_PRECOMPUTE()
        )
        //todo: bind the following
        // cookingParams.meshCookingHint =
        //     _emscripten_enum_PxMeshCookingHintEnum_eCOOKING_PERFORMANCE()
        return Px.CreateCooking(version, foundation, cookingParams)
    })

    //create default convex flags
    const getConvexFlags = lazy(
        () =>
            new PxConvexFlags(
                _emscripten_enum_PxConvexFlagEnum_eCOMPUTE_CONVEX() |
                    _emscripten_enum_PxConvexFlagEnum_eDISABLE_MESH_VALIDATION() |
                    _emscripten_enum_PxConvexFlagEnum_eFAST_INERTIA_COMPUTATION()
            )
    )

    //create insertion callback
    const getInsertionCallback = lazy(() =>
        physics.getPhysicsInsertionCallback()
    )

    //create controller hit callback
    const controllerHitCallback = new PxUserControllerHitReportImpl()
    //onControllerHit, onObstacleHit
    controllerHitCallback.onShapeHit = (h: any) => {
        const hit = wrapPointer(h, PxControllerShapeHit)
        // hit.worldNormal
        // hit.worldPos
        const controllerManager = controllerManagerMap.get(hit.controller)
        const manager = actorPtrManagerMap.get(hit.actor.ptr)
        if (!controllerManager || !manager) return

        const contacts = forceGetInstance(
            controllerManagerContactMap,
            controllerManager,
            Set<PhysicsObjectManager>
        )
        contacts.add(manager)
        clearCollectionEffectSystem.add(contacts)
    }
    controllerHitCallback.onControllerHit = (h: any) => {}

    //create simulation event callback
    const simulationEventCallback = new PxSimulationEventCallbackImpl()
    simulationEventCallback.onContact = (pairHeader: any, pairs: any) => {
        const pairsWrapped = wrapPointer(pairs, PxContactPair)
        const pairHeaderWrapped = wrapPointer(pairHeader, PxContactPairHeader)

        const manager0 = actorPtrManagerMap.get(
            pairHeaderWrapped.get_actors(0).ptr
        )
        const manager1 = actorPtrManagerMap.get(
            pairHeaderWrapped.get_actors(1).ptr
        )
        if (!manager0 || !manager1) return

        const contacts0 = forceGetInstance(managerContactMap, manager0, WeakSet)
        const contacts1 = forceGetInstance(managerContactMap, manager1, WeakSet)

        const pair = NativeArrayHelpers.prototype.getContactPairAt(
            pairsWrapped,
            0
        )
        const evts = pair.events
        if (evts.isSet(_emscripten_enum_PxPairFlagEnum_eNOTIFY_TOUCH_FOUND())) {
            contacts0.add(manager1)
            contacts1.add(manager0)
        } else if (
            evts.isSet(_emscripten_enum_PxPairFlagEnum_eNOTIFY_TOUCH_LOST())
        ) {
            contacts0.delete(manager1)
            contacts1.delete(manager0)
        }
    }

    // create scene
    const pxVec = new PxVec3(0, 0, 0)
    const pxVec_ = new PxVec3(0, 0, 0)
    const pxVec__ = new PxVec3(0, 0, 0)
    const pxExtendedVec = new PxExtendedVec3(0, 0, 0)
    const sceneDesc = new PxSceneDesc(scale)
    // const filteringMode = _emscripten_enum_PxPairFilteringModeEnum_eKEEP()
    // sceneDesc.set_staticKineFilteringMode(filteringMode)
    // sceneDesc.set_kineKineFilteringMode(filteringMode)
    sceneDesc.set_cpuDispatcher(Px.DefaultCpuDispatcherCreate(0))
    sceneDesc.set_filterShader(Px.ContactReportFilterShader())
    sceneDesc.set_simulationEventCallback(simulationEventCallback)
    const pxScene = physics.createScene(sceneDesc)

    // set gravity
    const gravityVec = new PxVec3(0, 0, 0)
    getGravity((val) => {
        gravityVec.set_y(val)
        pxScene.setGravity(gravityVec)
    })

    // create a default material
    // static friction, dynamic friction, restitution
    const material = physics.createMaterial(0.5, 0.5, 0.5)

    // create default simulation shape flags
    const shapeFlags = new PxShapeFlags(
        _emscripten_enum_PxShapeFlagEnum_eSCENE_QUERY_SHAPE() |
            _emscripten_enum_PxShapeFlagEnum_eSIMULATION_SHAPE()
    )

    // create a few temporary objects used during setup
    const pxIdentity = _emscripten_enum_PxIDENTITYEnum_PxIdentity()
    const pxTransform = new PxTransform(pxIdentity)
    const pxTransform_ = new PxTransform(pxIdentity)
    const pxTransform__ = new PxTransform(pxIdentity)
    const pxFilterData = new PxFilterData(1, 1, 0, 0)
    const pxQuat = new PxQuat(0, 0, 0, 1)

    // create raycast query
    const raycastResult = new PxRaycastBuffer10()
    const pxRaycast = (
        origin: any,
        direction: any,
        maxDistance: number,
        excludePtr?: number
    ) => {
        if (!pxScene.raycast(origin, direction, maxDistance, raycastResult))
            return

        let distMin = Infinity
        let hitDistMin: any
        const iMax = raycastResult.getNbAnyHits()
        for (let i = 0; i < iMax; ++i) {
            const hit = raycastResult.getAnyHit(i)
            if (hit.actor.ptr === excludePtr || hit.distance > distMin) continue
            distMin = hit.distance
            hitDistMin = hit
        }
        return hitDistMin
    }

    // create overlap query
    const overlapResult = new PxOverlapBuffer10()
    const pxOverlap = (shape: any, transform: any) => {
        if (!pxScene.overlap(shape, transform, overlapResult)) return []
        const hits = []
        const iMax = overlapResult.getNbAnyHits()
        for (let i = 0; i < iMax; ++i) {
            const hit = overlapResult.getAnyHit(i)
            hits.push(hit)
        }
        return hits
    }

    // create sweep query
    const sweepResult = new PxSweepBuffer10()
    const pxSweep = (
        shape: any,
        transform: any,
        direction: any,
        distance: number
    ) => {
        if (!pxScene.sweep(shape, transform, direction, distance, sweepResult))
            return []
        const hits = []
        const iMax = sweepResult.getNbAnyHits()
        for (let i = 0; i < iMax; ++i) {
            const hit = sweepResult.getAnyHit(i)
            hits.push(hit)
        }
        return hits
    }

    // create PxController
    const getPxControllerManager = lazy(() =>
        Px.CreateControllerManager(pxScene)
    )
    const pxControllerFilters = new PxControllerFilters()

    //port PxCreateDynamic
    const PxGeometryTypeEnum = {
        eBOX: lazy(_emscripten_enum_PxGeometryTypeEnum_eBOX),
        eSPHERE: lazy(_emscripten_enum_PxGeometryTypeEnum_eSPHERE),
        eCAPSULE: lazy(_emscripten_enum_PxGeometryTypeEnum_eCAPSULE),
        eCONVEXMESH: lazy(_emscripten_enum_PxGeometryTypeEnum_eCONVEXMESH)
    }

    const isDynamicGeometry = (type: any) =>
        type == PxGeometryTypeEnum.eBOX() ||
        type == PxGeometryTypeEnum.eSPHERE() ||
        type == PxGeometryTypeEnum.eCAPSULE() ||
        type == PxGeometryTypeEnum.eCONVEXMESH()

    const PxCreateDynamic2 = (
        sdk: any,
        transform: any,
        shape: any,
        density: number
    ) => {
        const actor = sdk.createRigidDynamic(transform)
        if (actor) {
            actor.attachShape(shape)
            actor.setMass(density)
            // PxRigidBodyExt.prototype.updateMassAndInertia(actor, density)
        }
        return actor
    }

    const PxCreateDynamic = (
        sdk: any,
        transform: any,
        geometry: any,
        material: any,
        density: any,
        shapeOffset: any
    ) => {
        if (!isDynamicGeometry(geometry.getType()) || density <= 0) return null
        const shape = sdk.createShape(geometry, material, true)
        if (!shape) return null
        shape.setLocalPose(shapeOffset)
        const body = PxCreateDynamic2(sdk, transform, shape, density)
        shape.release()
        return body
    }

    // controller enum
    const PxCapsuleClimbingModeEnum = {
        eEASY: lazy(_emscripten_enum_PxCapsuleClimbingModeEnum_eEASY),
        eCONSTRAINED: lazy(
            _emscripten_enum_PxCapsuleClimbingModeEnum_eCONSTRAINED
        )
    }
    const PxControllerBehaviorFlagEnum = {
        eCCT_CAN_RIDE_ON_OBJECT: lazy(
            _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_CAN_RIDE_ON_OBJECT
        ),
        eCCT_SLIDE: lazy(
            _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_SLIDE
        ),
        eCCT_USER_DEFINED_RIDE: lazy(
            _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_USER_DEFINED_RIDE
        )
    }
    const PxControllerCollisionFlagEnum = {
        eCOLLISION_SIDES: lazy(
            _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_SIDES
        ),
        eCOLLISION_UP: lazy(
            _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_UP
        ),
        eCOLLISION_DOWN: lazy(
            _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_DOWN
        )
    }
    const PxControllerNonWalkableModeEnum = {
        ePREVENT_CLIMBING: lazy(
            _emscripten_enum_PxControllerNonWalkableModeEnum_ePREVENT_CLIMBING
        ),
        ePREVENT_CLIMBING_AND_FORCE_SLIDING: lazy(
            _emscripten_enum_PxControllerNonWalkableModeEnum_ePREVENT_CLIMBING_AND_FORCE_SLIDING
        )
    }
    const PxControllerShapeTypeEnum = {
        eBOX: lazy(_emscripten_enum_PxControllerShapeTypeEnum_eBOX),
        eCAPSULE: lazy(_emscripten_enum_PxControllerShapeTypeEnum_eCAPSULE)
    }

    // force mode enum
    const PxForceModeEnum = {
        eFORCE: lazy(_emscripten_enum_PxForceModeEnum_eFORCE),
        eIMPULSE: lazy(_emscripten_enum_PxForceModeEnum_eIMPULSE),
        eVELOCITY_CHANGE: lazy(
            _emscripten_enum_PxForceModeEnum_eVELOCITY_CHANGE
        ),
        eACCELERATION: lazy(_emscripten_enum_PxForceModeEnum_eACCELERATION)
    }

    // actor flag enum
    const PxActorFlagEnum = {
        eDISABLE_GRAVITY: lazy(
            _emscripten_enum_PxActorFlagEnum_eDISABLE_GRAVITY
        ),
        eSEND_SLEEP_NOTIFIES: lazy(
            _emscripten_enum_PxActorFlagEnum_eSEND_SLEEP_NOTIFIES
        ),
        eDISABLE_SIMULATION: lazy(
            _emscripten_enum_PxActorFlagEnum_eDISABLE_SIMULATION
        ),
        eVISUALIZATION: lazy(_emscripten_enum_PxActorFlagEnum_eVISUALIZATION)
    }

    // articulation joint type enum
    const PxArticulationJointTypeEnum = {
        ePRISMATIC: lazy(
            _emscripten_enum_PxArticulationJointTypeEnum_ePRISMATIC
        ),
        eREVOLUTE: lazy(_emscripten_enum_PxArticulationJointTypeEnum_eREVOLUTE),
        eSPHERICAL: lazy(
            _emscripten_enum_PxArticulationJointTypeEnum_eSPHERICAL
        ),
        eFIX: lazy(_emscripten_enum_PxArticulationJointTypeEnum_eFIX),
        eUNDEFINED: lazy(
            _emscripten_enum_PxArticulationJointTypeEnum_eUNDEFINED
        )
    }

    // articulation axis enum
    const PxArticulationAxisEnum = {
        eTWIST: lazy(_emscripten_enum_PxArticulationAxisEnum_eTWIST),
        eSWING1: lazy(_emscripten_enum_PxArticulationAxisEnum_eSWING1),
        eSWING2: lazy(_emscripten_enum_PxArticulationAxisEnum_eSWING2),
        eX: lazy(_emscripten_enum_PxArticulationAxisEnum_eX),
        eY: lazy(_emscripten_enum_PxArticulationAxisEnum_eY),
        eZ: lazy(_emscripten_enum_PxArticulationAxisEnum_eZ),
        eCOUNT: lazy(_emscripten_enum_PxArticulationAxisEnum_eCOUNT)
    }

    // articulation motion enum
    const PxArticulationMotionEnum = {
        eLOCKED: lazy(_emscripten_enum_PxArticulationMotionEnum_eLOCKED),
        eLIMITED: lazy(_emscripten_enum_PxArticulationMotionEnum_eLIMITED),
        eFREE: lazy(_emscripten_enum_PxArticulationMotionEnum_eFREE)
    }

    // rigid body flag enum
    const PxRigidBodyFlagEnum = {
        eKINEMATIC: lazy(_emscripten_enum_PxRigidBodyFlagEnum_eKINEMATIC),
        eUSE_KINEMATIC_TARGET_FOR_SCENE_QUERIES: lazy(
            _emscripten_enum_PxRigidBodyFlagEnum_eUSE_KINEMATIC_TARGET_FOR_SCENE_QUERIES
        ),
        eENABLE_CCD: lazy(_emscripten_enum_PxRigidBodyFlagEnum_eENABLE_CCD),
        eENABLE_CCD_FRICTION: lazy(
            _emscripten_enum_PxRigidBodyFlagEnum_eENABLE_CCD_FRICTION
        ),
        eENABLE_POSE_INTEGRATION_PREVIEW: lazy(
            _emscripten_enum_PxRigidBodyFlagEnum_eENABLE_POSE_INTEGRATION_PREVIEW
        ),
        eENABLE_SPECULATIVE_CCD: lazy(
            _emscripten_enum_PxRigidBodyFlagEnum_eENABLE_SPECULATIVE_CCD
        ),
        eENABLE_CCD_MAX_CONTACT_IMPULSE: lazy(
            _emscripten_enum_PxRigidBodyFlagEnum_eENABLE_CCD_MAX_CONTACT_IMPULSE
        ),
        eRETAIN_ACCELERATIONS: lazy(
            _emscripten_enum_PxRigidBodyFlagEnum_eRETAIN_ACCELERATIONS
        )
    }

    // spherical joint flag enum
    const PxSphericalJointFlagEnum = {
        eLIMIT_ENABLED: lazy(
            _emscripten_enum_PxSphericalJointFlagEnum_eLIMIT_ENABLED
        )
    }

    // prismatic joint flag enum
    const PxPrismaticJointFlagEnum = {
        eLIMIT_ENABLED: lazy(
            _emscripten_enum_PxPrismaticJointFlagEnum_eLIMIT_ENABLED
        )
    }

    // revolute joint flag enum
    const PxRevoluteJointFlagEnum = {
        eLIMIT_ENABLED: lazy(
            _emscripten_enum_PxRevoluteJointFlagEnum_eLIMIT_ENABLED
        ),
        eDRIVE_ENABLED: lazy(
            _emscripten_enum_PxRevoluteJointFlagEnum_eDRIVE_ENABLED
        )
    }

    // cache flag enum
    const PxArticulationCacheFlagEnum = {
        eALL: lazy(_emscripten_enum_PxArticulationCacheFlagEnum_eALL),
        ePOSITION: lazy(_emscripten_enum_PxArticulationCacheFlagEnum_ePOSITION)
    }

    // d6 axis enum
    const PxD6AxisEnum = {
        eX: lazy(_emscripten_enum_PxD6AxisEnum_eX),
        eY: lazy(_emscripten_enum_PxD6AxisEnum_eY),
        eZ: lazy(_emscripten_enum_PxD6AxisEnum_eZ),
        eSWING1: lazy(_emscripten_enum_PxD6AxisEnum_eSWING1),
        eSWING2: lazy(_emscripten_enum_PxD6AxisEnum_eSWING2),
        eTWIST: lazy(_emscripten_enum_PxD6AxisEnum_eTWIST),
        eCOUNT: lazy(_emscripten_enum_PxD6AxisEnum_eCOUNT)
    }

    // d6 motion enum
    const PxD6MotionEnum = {
        eLOCKED: lazy(_emscripten_enum_PxD6MotionEnum_eLOCKED),
        eLIMITED: lazy(_emscripten_enum_PxD6MotionEnum_eLIMITED),
        eFREE: lazy(_emscripten_enum_PxD6MotionEnum_eFREE)
    }

    //d6 drive enum
    const PxD6DriveEnum = {
        eX: lazy(_emscripten_enum_PxD6DriveEnum_eX),
        eY: lazy(_emscripten_enum_PxD6DriveEnum_eY),
        eZ: lazy(_emscripten_enum_PxD6DriveEnum_eZ),
        eSWING: lazy(_emscripten_enum_PxD6DriveEnum_eSWING),
        eTWIST: lazy(_emscripten_enum_PxD6DriveEnum_eTWIST),
        eSLERP: lazy(_emscripten_enum_PxD6DriveEnum_eSLERP)
    }

    physxPtr[0] = {
        destroy: (target: any) =>
            "release" in target ? target.release() : destroy(target),
        controllerHitCallback,
        NativeArrayHelpers,
        physics,
        material,
        shapeFlags,
        pxRaycast,
        pxOverlap,
        pxSweep,
        pxQuat,
        pxVec,
        pxVec_,
        pxVec__,
        pxExtendedVec,
        pxTransform,
        pxTransform_,
        pxTransform__,
        pxFilterData,
        pxControllerFilters,
        pxScene,
        getCooking,
        getConvexFlags,
        getInsertionCallback,
        getPxControllerManager,
        Vector_PxVec3,
        Vector_PxReal,
        Vector_PxU32,
        Px,
        PxBoxGeometry,
        PxCapsuleGeometry,
        PxSphereGeometry,
        PxPlaneGeometry,
        PxConvexMeshDesc,
        PxConvexMeshGeometry,
        PxRigidActorExt,
        PxRigidBodyExt,
        PxBoundedData,
        PxTriangleMeshDesc,
        PxTriangleMeshGeometry,
        PxCapsuleControllerDesc,
        PxJointLimitCone,
        PxJointAngularLimitPair,
        PxJointLinearLimit,
        PxJointLinearLimitPair,
        PxShapeExt,
        PxD6Drive,
        PxD6JointDrive,
        PxCreateDynamic,
        PxCapsuleClimbingModeEnum,
        PxControllerBehaviorFlagEnum,
        PxControllerCollisionFlagEnum,
        PxControllerNonWalkableModeEnum,
        PxControllerShapeTypeEnum,
        PxForceModeEnum,
        PxActorFlagEnum,
        PxArticulationJointTypeEnum,
        PxArticulationAxisEnum,
        PxArticulationMotionEnum,
        PxRigidBodyFlagEnum,
        PxSphericalJointFlagEnum,
        PxPrismaticJointFlagEnum,
        PxRevoluteJointFlagEnum,
        PxArticulationCacheFlagEnum,
        PxD6AxisEnum,
        PxD6MotionEnum,
        PxD6DriveEnum
    }
    setPhysXLoaded(true)
})()
