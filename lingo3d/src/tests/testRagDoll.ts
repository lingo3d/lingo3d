import { createEffect } from "@lincode/reactivity"
import { assignPxPose } from "../display/core/PhysicsObjectManager/physx/updatePxVec"
import Cube from "../display/primitives/Cube"
import { getPhysX } from "../states/usePhysX"
import "../display/core/PhysicsObjectManager/physx"
import { onLoop } from "../events/onLoop"

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
        PxArticulationCacheFlagEnum,
        NativeArrayHelpers
    } = getPhysX()
    if (!physics) return

    const articulation = physics.createArticulationReducedCoordinate()

    const torso = articulation.createLink(
        null,
        assignPxPose(torsoCube.outerObject3d)
    )
    //@ts-ignore
    torsoCube.getPxShape(true, torso)
    PxRigidBodyExt.prototype.setMassAndUpdateInertia(torso, 20)

    const head = articulation.createLink(
        torso,
        assignPxPose(headCube.outerObject3d)
    )
    //@ts-ignore
    headCube.getPxShape(true, head)
    PxRigidBodyExt.prototype.setMassAndUpdateInertia(head, 5)

    const joint = head.getInboundJoint()

    // joint.setJointType(PxArticulationJointTypeEnum.eSPHERICAL())
    // joint.setMotion(
    //     PxArticulationAxisEnum.eTWIST() |
    //         PxArticulationAxisEnum.eSWING1() |
    //         PxArticulationAxisEnum.eSWING2(),
    //     PxArticulationMotionEnum.eFREE()
    // )

    scene.addArticulation(articulation)

    // Read the articulation cache
    const cache = articulation.createCache()
    const handle = onLoop(() => {
        articulation.copyInternalStateToCache(
            cache,
            PxArticulationCacheFlagEnum.eALL()
        )
        console.log(articulation.computeGeneralizedMassMatrix())
        // console.log(NativeArrayHelpers.prototype.getRealAt(cache.jointPosition, 1))
    })
    return () => {
        handle.cancel()
    }
}, [getPhysX])
