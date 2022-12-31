import { Reactive } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import {
    articulationJointDefaults,
    articulationJointSchema
} from "../interface/IArticulationJoint"
import { getCameraRendered } from "../states/useCameraRendered"
import { getPhysX } from "../states/usePhysX"
import MeshManager from "./core/MeshManager"
import PhysicsObjectManager from "./core/PhysicsObjectManager"
import {
    assignPxTransform_,
    setPxTransform
} from "./core/PhysicsObjectManager/physx/pxMath"
import PositionedManager from "./core/PositionedManager"
import { getMeshManagerSets } from "./core/StaticObjectManager"
import { addSelectionHelper } from "./core/StaticObjectManager/raycast/selectionCandidates"
import HelperSphere from "./core/utils/HelperSphere"
import computeJointPxTransform, {
    computeJointPxTransform_
} from "./utils/computeJointPxTransform"

const createLimitedSpherical = (a0: any, t0: any, a1: any, t1: any) => {
    const { physics, Px, PxJointLimitCone, PxSphericalJointFlagEnum } =
        getPhysX()

    const j = Px.SphericalJointCreate(physics, a0, t0, a1, t1)
    // j.setLimitCone(new PxJointLimitCone(Math.PI / 2, Math.PI / 2, 0.05))
    // j.setSphericalJointFlag(PxSphericalJointFlagEnum.eLIMIT_ENABLED(), true)
    return j
}

export default class Joint extends PositionedManager {
    public static componentName = "Joint"
    public static defaults = articulationJointDefaults
    public static schema = articulationJointSchema

    public constructor() {
        super()
        import("./core/PhysicsObjectManager/physx")

        this.createEffect(() => {
            if (getCameraRendered() !== mainCamera) return

            const sphere = new HelperSphere()
            sphere.scale = 0.1
            const handle = addSelectionHelper(sphere, this)
            return () => {
                handle.cancel()
            }
        }, [getCameraRendered])

        this.createEffect(() => {
            const { physics, PxRigidBodyExt } = getPhysX()
            if (!physics) return

            const to = this.toState.get()
            const from = this.fromState.get()
            if (!to || !from) return

            const [[toManager]] = getMeshManagerSets(to)
            const [[fromManager]] = getMeshManagerSets(from)
            if (
                !(toManager instanceof PhysicsObjectManager) ||
                !(fromManager instanceof PhysicsObjectManager)
            )
                return

            toManager.physics = true
            fromManager.physics = true

            queueMicrotask(() => {
                const identityTransform = setPxTransform(0, 0, 0)
                createLimitedSpherical(
                    null,
                    identityTransform,
                    fromManager.actor,
                    assignPxTransform_(fromManager)
                )
                createLimitedSpherical(
                    fromManager.actor,
                    computeJointPxTransform_(this, fromManager),
                    toManager.actor,
                    computeJointPxTransform(this, toManager)
                )

                PxRigidBodyExt.prototype.updateMassAndInertia(
                    fromManager.actor,
                    fromManager.mass
                )
                PxRigidBodyExt.prototype.updateMassAndInertia(
                    toManager.actor,
                    toManager.mass
                )
            })
        }, [this.toState.get, this.fromState.get, getPhysX])
    }

    private toState = new Reactive<string | MeshManager | undefined>(undefined)
    public get to() {
        return this.toState.get()
    }
    public set to(val) {
        this.toState.set(val)
    }

    private fromState = new Reactive<string | MeshManager | undefined>(
        undefined
    )
    public get from() {
        return this.fromState.get()
    }
    public set from(val) {
        this.fromState.set(val)
    }
}
