import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import threeScene from "../engine/scene"
import { getPhysX } from "../states/usePhysX"
import PhysicsObjectManager from "./core/PhysicsObjectManager"
import destroy from "./core/PhysicsObjectManager/physx/destroy"
import { managerShapeLinkMap } from "./core/PhysicsObjectManager/physx/pxMaps"
import { assignPxPose } from "./core/PhysicsObjectManager/physx/updatePxVec"

export default class Articulation extends Appendable {
    public constructor() {
        super()
        this.createEffect(() => {
            const {
                physics,
                PxRigidBodyExt,
                PxArticulationJointTypeEnum,
                PxArticulationAxisEnum,
                PxArticulationMotionEnum,
                scene
            } = getPhysX()
            if (!physics) return

            const [torsoCube] = this.children ?? []
            if (!(torsoCube instanceof PhysicsObjectManager)) return

            threeScene.attach(torsoCube.outerObject3d)
            torsoCube.physics = false

            const articulation = physics.createArticulationReducedCoordinate()

            const torsoLink = articulation.createLink(
                null,
                assignPxPose(torsoCube.outerObject3d)
            )
            const torsoShape = torsoCube.getPxShape(true, torsoLink)
            // PxRigidBodyExt.prototype.updateMassAndInertia(torsoLink, 3)
            managerShapeLinkMap.set(torsoCube, [torsoShape, torsoLink])

            const traverse = (
                parent: PhysicsObjectManager,
                parentLink: any
            ) => {
                const [headCube] = parent.children ?? []
                if (!(headCube instanceof PhysicsObjectManager)) return

                threeScene.attach(headCube.outerObject3d)
                headCube.physics = false

                const headLink = articulation.createLink(
                    parentLink,
                    assignPxPose(headCube.outerObject3d)
                )
                const headShape = headCube.getPxShape(true, headLink)
                // PxRigidBodyExt.prototype.updateMassAndInertia(headLink, 1)
                managerShapeLinkMap.set(headCube, [headShape, headLink])

                const joint = headLink.getInboundJoint()
                joint.setJointType(PxArticulationJointTypeEnum.eREVOLUTE())
                joint.setMotion(
                    PxArticulationAxisEnum.eTWIST(),
                    PxArticulationMotionEnum.eFREE()
                )
                joint.setMotion(
                    PxArticulationAxisEnum.eSWING1(),
                    PxArticulationMotionEnum.eFREE()
                )
                joint.setMotion(
                    PxArticulationAxisEnum.eSWING2(),
                    PxArticulationMotionEnum.eFREE()
                )
                traverse(headCube, headLink)
            }
            traverse(torsoCube, torsoLink)

            scene.addArticulation(articulation)

            return () => {
                destroy(articulation)
            }
        }, [this.refreshState.get, getPhysX])
    }

    private refreshState = new Reactive({})

    public override append(child: Appendable) {
        super.append(child)
        this.refreshState.set({})
    }
}
