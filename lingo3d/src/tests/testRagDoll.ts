import { createEffect } from "@lincode/reactivity"
import { log } from "@lincode/utils"
import { assignPxPose } from "../display/core/PhysicsObjectManager/physx/updatePxVec"
import Cube from "../display/primitives/Cube"
import { getPhysX } from "../states/usePhysX"
import callPrivateMethod from "../utils/callPrivateMethod"

const ground = new Cube()
ground.width = 1000
ground.height = 10
ground.depth = 1000
ground.y = -300
ground.color = "black"
ground.physics = "map"

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
    const { physics, PxRigidBodyExt, scene } = getPhysX()
    if (!physics) return

    const articulation = physics.createArticulationReducedCoordinate()

    const torsoPose = assignPxPose(torsoCube.outerObject3d)
    const torso = articulation.createLink(null, torsoPose)
    //@ts-ignore
    torsoCube.getPxShape(true, torso)
    PxRigidBodyExt.prototype.setMassAndUpdateInertia(torso, 20)

    const headPose = assignPxPose(headCube.outerObject3d)
    const head = articulation.createLink(torso, headPose)
    //@ts-ignore
    headCube.getPxShape(true, head)
    PxRigidBodyExt.prototype.setMassAndUpdateInertia(head, 5)

    const joint = head.getInboundJoint()

    // joint.setParentPose(parentAttachment);
    // joint->setChildPose(childAttachment);

    // scene.addArticulation(articulation)
}, [getPhysX])
