import { lazy } from "@lincode/utils"
//@ts-ignore
import PhysX from "physx-js-webidl"
import { gravityPtr } from "../../../../states/useGravity"
import { setPhysX } from "../../../../states/usePhysX"
import { destroyPtr } from "./destroy"
import "./physxLoop"

PhysX().then((PhysX: any) => {
    const {
        destroy,
        PxSimulationEventCallback,
        PxTopLevelFunctions,
        PxDefaultAllocator,
        PxDefaultErrorCallback,
        PxTolerancesScale,
        PxCookingParams,
        PxConvexFlags,
        PxVec3,
        PxSceneDesc,
        PxShapeFlags,
        PxTransform,
        PxFilterData,
        PxBoxGeometry,
        PxCapsuleGeometry,
        PxConvexMeshDesc,
        PxConvexMeshGeometry,
        PxRigidActorExt,
        Vector_PxVec3,
        PxBoundedData,
        Vector_PxU32,
        PxTriangleMeshDesc,
        PxTriangleMeshGeometry,
        PxQuat,
        PxCapsuleControllerDesc,
        PxControllerFilters,
        PxRaycastBuffer10,
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
        _emscripten_enum_PxPairFlagEnum_eNOTIFY_CONTACT_POINTS
    } = PhysX

    destroyPtr[0] = destroy
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
    // Px.InitExtensions(physics)

    //create PxCooking
    const getCooking = lazy(() => {
        const cookingParams = new PxCookingParams(scale)
        cookingParams.suppressTriangleMeshRemapTable = true
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

    // create scene
    const pxVec = new PxVec3(0, gravityPtr[0], 0)
    const pxVec_ = new PxVec3(0, 0, 0)
    const sceneDesc = new PxSceneDesc(scale)
    sceneDesc.set_gravity(pxVec)
    sceneDesc.set_cpuDispatcher(Px.DefaultCpuDispatcherCreate(0))
    sceneDesc.set_filterShader(Px.DefaultFilterShader())
    // sceneDesc.set_simulationEventCallback(
    //     Object.create(PxSimulationEventCallback.prototype, {
    //         onContact: {
    //             value: (pairHeader: any, pairs: any, nbPairs: any) => {
    //                 console.log("onContact")
    //             }
    //         },
    //         onTrigger: {
    //             value: (pairs: any, nbPairs: any) => {
    //                 console.log("onTrigger")
    //             }
    //         }
    //     })
    // )
    const scene = physics.createScene(sceneDesc)

    // create a default material
    // static friction, dynamic friction, restitution
    const material = physics.createMaterial(0.5, 0.5, 0.5)

    // create default simulation shape flags
    const shapeFlags = new PxShapeFlags(
        _emscripten_enum_PxShapeFlagEnum_eSCENE_QUERY_SHAPE() |
            _emscripten_enum_PxShapeFlagEnum_eSIMULATION_SHAPE()
    )

    // create a few temporary objects used during setup
    const pxPose = new PxTransform(_emscripten_enum_PxIDENTITYEnum_PxIdentity())
    const pxFilterData = new PxFilterData(1, 1, 0, 0)
    const pxQuat = new PxQuat(0, 0, 0, 1)

    // create raycaster
    const raycastResult = new PxRaycastBuffer10()
    const pxRaycast = (
        origin: any,
        direction: any,
        maxDistance: number,
        excludePtr?: number
    ) => {
        if (!scene.raycast(origin, direction, maxDistance, raycastResult))
            return

        if (excludePtr) {
            const iMax = raycastResult.getNbAnyHits()
            for (let i = 0; i < iMax; ++i) {
                const hit = raycastResult.getAnyHit(i)
                if (hit.actor.ptr !== excludePtr) return hit
            }
            return
        }
        return raycastResult.getAnyHit()
    }

    // create PxController
    const getPxControllerManager = lazy(() => Px.CreateControllerManager(scene))
    const pxControllerFilters = new PxControllerFilters()

    // controller enums
    const PxCapsuleClimbingModeEnum = {
        eEASY: lazy(() => _emscripten_enum_PxCapsuleClimbingModeEnum_eEASY()),
        eCONSTRAINED: lazy(() =>
            _emscripten_enum_PxCapsuleClimbingModeEnum_eCONSTRAINED()
        )
    }
    const PxControllerBehaviorFlagEnum = {
        eCCT_CAN_RIDE_ON_OBJECT: lazy(() =>
            _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_CAN_RIDE_ON_OBJECT()
        ),
        eCCT_SLIDE: lazy(() =>
            _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_SLIDE()
        ),
        eCCT_USER_DEFINED_RIDE: lazy(() =>
            _emscripten_enum_PxControllerBehaviorFlagEnum_eCCT_USER_DEFINED_RIDE()
        )
    }
    const PxControllerCollisionFlagEnum = {
        eCOLLISION_SIDES: lazy(() =>
            _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_SIDES()
        ),
        eCOLLISION_UP: lazy(() =>
            _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_UP()
        ),
        eCOLLISION_DOWN: lazy(() =>
            _emscripten_enum_PxControllerCollisionFlagEnum_eCOLLISION_DOWN()
        )
    }
    const PxControllerNonWalkableModeEnum = {
        ePREVENT_CLIMBING: lazy(() =>
            _emscripten_enum_PxControllerNonWalkableModeEnum_ePREVENT_CLIMBING()
        ),
        ePREVENT_CLIMBING_AND_FORCE_SLIDING: lazy(() =>
            _emscripten_enum_PxControllerNonWalkableModeEnum_ePREVENT_CLIMBING_AND_FORCE_SLIDING()
        )
    }
    const PxControllerShapeTypeEnum = {
        eBOX: lazy(() => _emscripten_enum_PxControllerShapeTypeEnum_eBOX()),
        eCAPSULE: lazy(() =>
            _emscripten_enum_PxControllerShapeTypeEnum_eCAPSULE()
        )
    }

    // force mode enums
    const PxForceModeEnum = {
        eFORCE: lazy(() => _emscripten_enum_PxForceModeEnum_eFORCE()),
        eIMPULSE: lazy(() => _emscripten_enum_PxForceModeEnum_eIMPULSE()),
        eVELOCITY_CHANGE: lazy(() =>
            _emscripten_enum_PxForceModeEnum_eVELOCITY_CHANGE()
        ),
        eACCELERATION: lazy(() =>
            _emscripten_enum_PxForceModeEnum_eACCELERATION()
        )
    }

    // actor flag enums
    const PxActorFlagEnum = {
        eDISABLE_GRAVITY: lazy(() =>
            _emscripten_enum_PxActorFlagEnum_eDISABLE_GRAVITY()
        ),
        eSEND_SLEEP_NOTIFIES: lazy(() =>
            _emscripten_enum_PxActorFlagEnum_eSEND_SLEEP_NOTIFIES()
        ),
        eDISABLE_SIMULATION: lazy(() =>
            _emscripten_enum_PxActorFlagEnum_eDISABLE_SIMULATION()
        ),
        eVISUALIZATION: lazy(() =>
            _emscripten_enum_PxActorFlagEnum_eVISUALIZATION()
        )
    }

    setPhysX({
        physics,
        material,
        shapeFlags,
        pxRaycast,
        pxQuat,
        pxVec,
        pxVec_,
        pxPose,
        pxFilterData,
        pxControllerFilters,
        scene,
        getCooking,
        getConvexFlags,
        getInsertionCallback,
        getPxControllerManager,
        Vector_PxVec3,
        Vector_PxU32,
        PxBoxGeometry,
        PxCapsuleGeometry,
        PxConvexMeshDesc,
        PxConvexMeshGeometry,
        PxRigidActorExt,
        PxBoundedData,
        PxTriangleMeshDesc,
        PxTriangleMeshGeometry,
        PxCapsuleControllerDesc,
        PxCapsuleClimbingModeEnum,
        PxControllerBehaviorFlagEnum,
        PxControllerCollisionFlagEnum,
        PxControllerNonWalkableModeEnum,
        PxControllerShapeTypeEnum,
        PxForceModeEnum,
        PxActorFlagEnum
    })
})
