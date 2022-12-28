import { createEffect } from "@lincode/reactivity"
import {
    assignPxPose,
    setPxPose,
    setPxPose_
} from "../display/core/PhysicsObjectManager/physx/updatePxVec"
import Cube from "../display/primitives/Cube"
import { getPhysX } from "../states/usePhysX"
import "../display/core/PhysicsObjectManager/physx"
import { onBeforeRender } from "../events/onBeforeRender"

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
        scene,
        PxRigidBodyFlagEnum,
        Px,
        PxSphericalJointFlagEnum,
        PxJointLimitCone,
        PxArticulationCacheFlagEnum
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
    const rootLink = articulation.createLink(null, createIdentity())
    //@ts-ignore
    torsoCube.getPxShape(true, rootLink)
    rootLink.setMass(1)
    rootLink.setCMassLocalPose(createIdentity())
    root.setGlobalPose(pose)

    const parent = rootLink
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
    joint.setSphericalJointFlag(PxSphericalJointFlagEnum.eLIMIT_ENABLED(), true)
    joint.setLimitCone(new PxJointLimitCone(Math.PI / 2, Math.PI / 2, 0.05))

    // Add the body to the articulation and set it as the new parent
    const headLink = articulation.createLink(parent, createIdentity())
    //@ts-ignore
    headCube.getPxShape(true, headLink)
    headLink.setMass(1)
    headLink.setCMassLocalPose(createIdentity())

    // Add the articulation to the scene
    scene.addArticulation(articulation)

    // Read the articulation cache
    const cache = articulation.createCache()
    onBeforeRender(() => {
        articulation.copyInternalStateToCache(
            cache,
            PxArticulationCacheFlagEnum.ePOSITION
        )
        console.log(cache)
        // console.log(rootLink.getLinkIndex(), headLink.getLinkIndex())
    })
}, [getPhysX])
