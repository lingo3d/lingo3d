import { Cancellable } from "@lincode/promiselikes"
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

            const [rootManager] = this.children ?? []
            if (!(rootManager instanceof PhysicsObjectManager)) return

            threeScene.attach(rootManager.outerObject3d)
            rootManager.physics = false

            const articulation = physics.createArticulationReducedCoordinate()

            const rootLink = articulation.createLink(
                null,
                assignPxPose(rootManager.outerObject3d)
            )
            const rootShape = rootManager.getPxShape(true, rootLink)
            PxRigidBodyExt.prototype.updateMassAndInertia(
                rootLink,
                rootManager.mass
            )
            managerShapeLinkMap.set(rootManager, [rootShape, rootLink])

            const handle = new Cancellable()
            const traverse = (
                parent: PhysicsObjectManager,
                parentLink: any
            ) => {
                const [childManager] = parent.children ?? []
                if (!(childManager instanceof PhysicsObjectManager)) return

                threeScene.attach(childManager.outerObject3d)
                childManager.physics = false

                const childLink = articulation.createLink(
                    parentLink,
                    assignPxPose(childManager.outerObject3d)
                )
                const childShape = childManager.getPxShape(true, childLink)
                PxRigidBodyExt.prototype.updateMassAndInertia(
                    childLink,
                    childManager.mass
                )
                managerShapeLinkMap.set(childManager, [childShape, childLink])

                const joint = childLink.getInboundJoint()
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
                handle.then(() => {
                    destroy(joint)
                    destroy(childLink)
                    destroy(childShape)
                    managerShapeLinkMap.delete(childManager)
                })
                traverse(childManager, childLink)
            }
            traverse(rootManager, rootLink)

            scene.addArticulation(articulation)

            return () => {
                handle.cancel()

                destroy(rootLink)
                destroy(rootShape)
                managerShapeLinkMap.delete(rootManager)

                scene.removeActor(articulation)
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
