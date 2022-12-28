import { createEffect } from "@lincode/reactivity"
import { managerActorMap } from "../display/core/PhysicsObjectManager/physx/pxMaps"
import {
    assignPxPose,
    setPxPose,
    setPxPose_
} from "../display/core/PhysicsObjectManager/physx/updatePxVec"
import Cube from "../display/primitives/Cube"
import { getPhysX } from "../states/usePhysX"
import "../display/core/PhysicsObjectManager/physx"

// const ground = new Cube()
// ground.width = 1000
// ground.height = 10
// ground.depth = 1000
// ground.y = -300
// ground.color = "black"
// ground.physics = "map"

const headCube = new Cube()
headCube.scaleX = headCube.scaleY = headCube.scaleZ = 0.25
headCube.y = 40

const torsoCube = new Cube()
torsoCube.scaleX = 0.35
torsoCube.scaleY = 0.45
torsoCube.scaleZ = 0.2

// const hipCube = new Cube()
// hipCube.scaleX = 0.35
// hipCube.scaleY = 0.1
// hipCube.scaleZ = 0.2
// hipCube.y = -30

createEffect(() => {
    const {
        physics,
        PxRigidBodyExt,
        scene,
        PxArticulationJointTypeEnum,
        PxArticulationAxisEnum,
        PxArticulationMotionEnum,
        PxRigidBodyFlagEnum,
        Px
    } = getPhysX()
    if (!physics) return

    const pose = setPxPose_(0, 0, 0)
    const createIdentity = () => setPxPose(0, 0, 0)

    // Create the root body
    const root = physics.createRigidDynamic(pose)
    root.setRigidBodyFlag(PxRigidBodyFlagEnum.eKINEMATIC(), true)

    // Create an articulation to hold the ragdoll bodies
    const articulation = physics.createArticulationReducedCoordinate()

    // Add the root body to the articulation
    const link = articulation.createLink(null, createIdentity())
    //@ts-ignore
    torsoCube.getPxShape(true, link)
    link.setMass(1)
    link.setCMassLocalPose(createIdentity())
    root.setGlobalPose(pose)
    managerActorMap.set(torsoCube, root)

    const parent = link
    // Create a new body
    const localTm = assignPxPose(headCube.outerObject3d)
    const body = physics.createRigidDynamic(localTm)
    body.setMass(1)

    // Create a joint between the parent and the new body
    const joint = Px.SphericalJointCreate(
        physics,
        parent,
        createIdentity(),
        body,
        localTm
    )
    // joint->setSphericalJointFlag(PxSphericalJointFlag::eLIMIT_ENABLED, true);
    // joint->setLimitCone(PxJointLimitCone(PxPi / 2, PxPi / 2, 0.05f));

    // // Add the body to the articulation and set it as the new parent
    // link = articulation->createLink(parent, PxTransform::createIdentity());
    // link->attachShape(*physics->createShape(PxBoxGeometry(dimensions.x, dimensions.y, dimensions.z),
    //                                         *physics->createMaterial(0.5f, 0.5f, 0.5f)));
    // link->setMass(1.0f);
    // link->setCMassLocalPose(PxTransform::createIdentity());

    // Add the articulation to the scene
    scene.addArticulation(articulation)
}, [getPhysX])
