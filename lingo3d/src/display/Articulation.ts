import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
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
                scene,
                PxArticulationJointTypeEnum,
                PxArticulationAxisEnum,
                PxArticulationMotionEnum
            } = getPhysX()
            if (!physics) return

            const [torsoCube] = this.children ?? []
            if (!(torsoCube instanceof PhysicsObjectManager)) return

            const articulation = physics.createArticulationReducedCoordinate()

            const torsoLink = articulation.createLink(
                null,
                assignPxPose(torsoCube.outerObject3d)
            )
            const torsoShape = torsoCube.getPxShape(true, torsoLink)
            PxRigidBodyExt.prototype.updateMassAndInertia(torsoLink, 3)
            managerShapeLinkMap.set(torsoCube, [torsoShape, torsoLink])

            return () => {
                destroy(articulation)
            }
        }, [this.refreshState.get, getPhysX])
    }

    private refreshState = new Reactive({})
    public refresh() {
        this.refreshState.set({})
    }
}
