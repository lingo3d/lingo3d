//@ts-ignore
import PhysX from "physx-js-webidl"
import { setPhysX } from "../../../../states/usePhysX"
import "./physxLoop"

PhysX().then(
    ({
        PxTopLevelFunctions,
        PxDefaultAllocator,
        PxDefaultErrorCallback,
        PxTolerancesScale,
        PxCookingParams,
        PxConvexFlags,
        _emscripten_enum_PxConvexFlagEnum_eCOMPUTE_CONVEX,
        _emscripten_enum_PxConvexFlagEnum_eDISABLE_MESH_VALIDATION,
        _emscripten_enum_PxConvexFlagEnum_eFAST_INERTIA_COMPUTATION,
        PxVec3,
        PxSceneDesc,
        PxShapeFlags,
        _emscripten_enum_PxShapeFlagEnum_eSCENE_QUERY_SHAPE,
        _emscripten_enum_PxShapeFlagEnum_eSIMULATION_SHAPE,
        PxTransform,
        _emscripten_enum_PxIDENTITYEnum_PxIdentity,
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
        PxQuat
    }: any) => {
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
        const cookingParams = new PxCookingParams(scale)
        cookingParams.suppressTriangleMeshRemapTable = true
        const cooking = Px.CreateCooking(version, foundation, cookingParams)

        //create default convex flags
        const convexFlags = new PxConvexFlags(
            _emscripten_enum_PxConvexFlagEnum_eCOMPUTE_CONVEX() |
                _emscripten_enum_PxConvexFlagEnum_eDISABLE_MESH_VALIDATION() |
                _emscripten_enum_PxConvexFlagEnum_eFAST_INERTIA_COMPUTATION()
        )

        //create insertion callback
        const insertionCallback = physics.getPhysicsInsertionCallback()

        // create scene
        const pxVec = new PxVec3(0, -9.81, 0)
        const sceneDesc = new PxSceneDesc(scale)
        sceneDesc.set_gravity(pxVec)
        sceneDesc.set_cpuDispatcher(Px.DefaultCpuDispatcherCreate(0))
        sceneDesc.set_filterShader(Px.DefaultFilterShader())
        const pxScene = physics.createScene(sceneDesc)

        // create a default material
        const material = physics.createMaterial(0.5, 0.5, 0.5)
        // create default simulation shape flags
        const shapeFlags = new PxShapeFlags(
            _emscripten_enum_PxShapeFlagEnum_eSCENE_QUERY_SHAPE() |
                _emscripten_enum_PxShapeFlagEnum_eSIMULATION_SHAPE()
        )

        // create a few temporary objects used during setup
        const pxPose = new PxTransform(
            _emscripten_enum_PxIDENTITYEnum_PxIdentity()
        )
        const pxFilterData = new PxFilterData(1, 1, 0, 0)
        const pxQuat = new PxQuat(0, 0, 0, 1)

        setPhysX({
            physics,
            material,
            shapeFlags,
            pxVec,
            pxPose,
            pxFilterData,
            pxScene,
            cooking,
            convexFlags,
            insertionCallback,
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
            pxQuat
        })

        // scene.release()
        // material.release()
        // physics.release()
        // foundation.release()
        // cooking.release()
        // destroy(errorCb)
        // destroy(allocator)
        // console.log("Cleaned up")
    }
)
