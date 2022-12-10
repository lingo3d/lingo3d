//@ts-ignore
import PhysX from "physx-js-webidl"

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

    // create a large static box with size 20x1x20 as ground
    const groundGeometry = new PhysX.PxBoxGeometry(10, 0.5, 10) // PxBoxGeometry uses half-sizes
    const groundShape = physics.createShape(
        groundGeometry,
        material,
        true,
        shapeFlags
    )
    const ground = physics.createRigidStatic(tmpPose)
    groundShape.setSimulationFilterData(tmpFilterData)
    ground.attachShape(groundShape)
    scene.addActor(ground)

    // create a small dynamic box with size 1x1x1, which will fall on the ground
    tmpVec.set_x(0)
    tmpVec.set_y(5)
    tmpVec.set_z(0)
    tmpPose.set_p(tmpVec)
    const boxGeometry = new PhysX.PxBoxGeometry(0.5, 0.5, 0.5) // PxBoxGeometry uses half-sizes
    const boxShape = physics.createShape(
        boxGeometry,
        material,
        true,
        shapeFlags
    )
    const box = physics.createRigidDynamic(tmpPose)
    boxShape.setSimulationFilterData(tmpFilterData)
    box.attachShape(boxShape)
    scene.addActor(box)

    // clean up temp objects
    PhysX.destroy(groundGeometry)
    PhysX.destroy(boxGeometry)
    PhysX.destroy(tmpFilterData)
    PhysX.destroy(tmpPose)
    PhysX.destroy(tmpVec)
    PhysX.destroy(shapeFlags)
    PhysX.destroy(sceneDesc)
    PhysX.destroy(tolerances)
    console.log("Created scene objects")

    // simulate scene for a bit
    for (var i = 0; i <= 300; i++) {
        scene.simulate(1.0 / 60.0)
        scene.fetchResults(true)
        if (i % 10 == 0) {
            var boxHeight = box.getGlobalPose().get_p().get_y()
            console.log("Sim step " + i + ": h = " + boxHeight)
        }
    }

    // cleanup stuff
    scene.removeActor(ground)
    ground.release()
    groundShape.release()

    scene.removeActor(box)
    box.release()
    boxShape.release()

    scene.release()
    material.release()
    physics.release()
    foundation.release()
    PhysX.destroy(errorCb)
    PhysX.destroy(allocator)
    console.log("Cleaned up")
})
