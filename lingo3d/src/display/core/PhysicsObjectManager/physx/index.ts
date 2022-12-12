//@ts-ignore
import PhysX from "physx-js-webidl"
import { setPhysX } from "../../../../states/usePhysX"
import "./physxLoop"

PhysX().then((PhysX: any) => {
    const Px = PhysX.PxTopLevelFunctions.prototype

    // create PxFoundation
    const version = Px.PHYSICS_VERSION
    const allocator = new PhysX.PxDefaultAllocator()
    const errorCb = new PhysX.PxDefaultErrorCallback()
    const foundation = Px.CreateFoundation(version, allocator, errorCb)

    //create PxPhysics
    const scale = new PhysX.PxTolerancesScale()
    const physics = Px.CreatePhysics(version, foundation, scale)

    //init extensions
    Px.InitExtensions(physics)

    //create PxCooking
    const cookingParams = new PhysX.PxCookingParams(scale)
    cookingParams.suppressTriangleMeshRemapTable = true
    const cooking = Px.CreateCooking(version, foundation, cookingParams)

    //create default convex flags
    const convexFlags = new PhysX.PxConvexFlags(
        PhysX._emscripten_enum_PxConvexFlagEnum_eCOMPUTE_CONVEX() |
            PhysX._emscripten_enum_PxConvexFlagEnum_eDISABLE_MESH_VALIDATION() |
            PhysX._emscripten_enum_PxConvexFlagEnum_eFAST_INERTIA_COMPUTATION()
    )

    //create insertion callback
    const insertionCallback = physics.getPhysicsInsertionCallback()

    // create scene
    const tmpVec = new PhysX.PxVec3(0, -9.81, 0)
    const sceneDesc = new PhysX.PxSceneDesc(scale)
    sceneDesc.set_gravity(tmpVec)
    sceneDesc.set_cpuDispatcher(Px.DefaultCpuDispatcherCreate(0))
    sceneDesc.set_filterShader(Px.DefaultFilterShader())
    const scene = physics.createScene(sceneDesc)

    // create a default material
    const material = physics.createMaterial(0.5, 0.5, 0.5)
    // create default simulation shape flags
    const shapeFlags = new PhysX.PxShapeFlags(
        PhysX._emscripten_enum_PxShapeFlagEnum_eSCENE_QUERY_SHAPE() |
            PhysX._emscripten_enum_PxShapeFlagEnum_eSIMULATION_SHAPE()
    )

    // create a few temporary objects used during setup
    const tmpPose = new PhysX.PxTransform(
        PhysX._emscripten_enum_PxIDENTITYEnum_PxIdentity()
    )
    const tmpFilterData = new PhysX.PxFilterData(1, 1, 0, 0)

    // clean up temp objects
    // PhysX.destroy(tmpFilterData)
    // PhysX.destroy(tmpPose)
    // PhysX.destroy(tmpVec)
    // PhysX.destroy(shapeFlags)
    // PhysX.destroy(convexFlags)
    // PhysX.destroy(sceneDesc)
    // PhysX.destroy(tolerances)

    setPhysX({
        PhysX,
        physics,
        material,
        shapeFlags,
        tmpVec,
        tmpPose,
        tmpFilterData,
        scene,
        cooking,
        convexFlags,
        insertionCallback
    })

    // scene.release()
    // material.release()
    // physics.release()
    // foundation.release()
    // cooking.release()
    // PhysX.destroy(errorCb)
    // PhysX.destroy(allocator)
    // console.log("Cleaned up")
})
