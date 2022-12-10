//@ts-ignore
import PhysX from "physx-js-webidl"
import { setPhysX } from "../../../../states/usePhysX"
import "./physxLoop"

PhysX().then((PhysX: any) => {
    console.log("PhysX loaded")

    const version = PhysX.PxTopLevelFunctions.prototype.PHYSICS_VERSION
    const allocator = new PhysX.PxDefaultAllocator()
    const errorCb = new PhysX.PxDefaultErrorCallback()
    const foundation = PhysX.PxTopLevelFunctions.prototype.CreateFoundation(
        version,
        allocator,
        errorCb
    )
    console.log("Created PxFoundation")

    const tolerances = new PhysX.PxTolerancesScale()
    const physics = PhysX.PxTopLevelFunctions.prototype.CreatePhysics(
        version,
        foundation,
        tolerances
    )
    console.log("Created PxPhysics")

    // create scene
    const tmpVec = new PhysX.PxVec3(0, -9.81, 0)
    const sceneDesc = new PhysX.PxSceneDesc(tolerances)
    sceneDesc.set_gravity(tmpVec)
    sceneDesc.set_cpuDispatcher(
        PhysX.PxTopLevelFunctions.prototype.DefaultCpuDispatcherCreate(0)
    )
    sceneDesc.set_filterShader(
        PhysX.PxTopLevelFunctions.prototype.DefaultFilterShader()
    )
    const scene = physics.createScene(sceneDesc)
    console.log("Created scene")

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
    PhysX.destroy(tmpFilterData)
    PhysX.destroy(tmpPose)
    PhysX.destroy(tmpVec)
    // PhysX.destroy(shapeFlags)
    PhysX.destroy(sceneDesc)
    PhysX.destroy(tolerances)
    console.log("Created scene objects")

    setPhysX({
        PhysX,
        physics,
        material,
        shapeFlags,
        tmpVec,
        tmpPose,
        tmpFilterData,
        scene
    })

    // scene.release()
    // material.release()
    // physics.release()
    // foundation.release()
    // PhysX.destroy(errorCb)
    // PhysX.destroy(allocator)
    // console.log("Cleaned up")
})
