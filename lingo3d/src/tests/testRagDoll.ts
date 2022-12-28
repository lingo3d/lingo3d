import { createEffect } from "@lincode/reactivity"
import { managerActorMap } from "../display/core/PhysicsObjectManager/physx/pxMaps"
import {
    assignPxPose,
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
        PxArticulationMotionEnum
    } = getPhysX()
    if (!physics) return

    const pose = setPxPose_(0, 0, 0)

    const articulation = physics.createArticulationReducedCoordinate()

    const torso = articulation.createLink(null, pose)
    //@ts-ignore
    torsoCube.getPxShape(true, torso)
    PxRigidBodyExt.prototype.setMassAndUpdateInertia(torso, 20)
    managerActorMap.set(torsoCube, torso)

    const head = articulation.createLink(torso, pose)
    //@ts-ignore
    headCube.getPxShape(true, head)
    PxRigidBodyExt.prototype.setMassAndUpdateInertia(head, 5)
    managerActorMap.set(headCube, head)

    const joint = head.getInboundJoint()
    joint.setParentPose(assignPxPose(torsoCube.outerObject3d))
    joint.setChildPose(assignPxPose(headCube.outerObject3d))

    joint.setJointType(PxArticulationJointTypeEnum.eREVOLUTE())
    joint.setMotion(
        PxArticulationAxisEnum.eSWING2(),
        PxArticulationMotionEnum.eLIMITED()
    )

    console.log(joint)

    scene.addArticulation(articulation)
}, [getPhysX])
