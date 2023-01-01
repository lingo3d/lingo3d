import { centroid3d } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import {
    articulationJointDefaults,
    articulationJointSchema
} from "../interface/IArticulationJoint"
import { getPhysX } from "../states/usePhysX"
import MeshManager from "./core/MeshManager"
import PhysicsObjectManager from "./core/PhysicsObjectManager"
import {
    assignPxTransform_,
    setPxTransform,
    setPxTransform_
} from "./core/PhysicsObjectManager/physx/pxMath"
import PositionedManager from "./core/PositionedManager"
import { getMeshManagerSets } from "./core/StaticObjectManager"
import { vector3 } from "./utils/reusables"
import { point2Vec } from "./utils/vec2Point"

const createLimitedSpherical = (a0: any, t0: any, a1: any, t1: any) => {
    const { physics, Px, PxJointLimitCone, PxSphericalJointFlagEnum } =
        getPhysX()

    const j = Px.SphericalJointCreate(physics, a0, t0, a1, t1)
    j.setLimitCone(new PxJointLimitCone(Math.PI / 2, Math.PI / 2, 0.05))
    j.setSphericalJointFlag(PxSphericalJointFlagEnum.eLIMIT_ENABLED(), true)
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

            const center = centroid3d([fromManager, toManager])
            const centerVec = point2Vec(center)
            Object.assign(this, center)

            if (fromManager.physics !== true) fromManager.physics = true
            if (toManager.physics !== true) toManager.physics = true

            queueMicrotask(() => {
                if (this.fixed)
                    createLimitedSpherical(
                        null,
                        setPxTransform(0, 0, 0),
                        fromManager.actor,
                        assignPxTransform_(fromManager)
                    )

                const offsetFrom = vector3
                    .copy(centerVec)
                    .sub(fromManager.position)

                const offsetTo = centerVec.sub(toManager.position)

                createLimitedSpherical(
                    fromManager.actor,
                    setPxTransform(offsetFrom.x, offsetFrom.y, offsetFrom.z),
                    toManager.actor,
                    setPxTransform_(offsetTo.x, offsetTo.y, offsetTo.z)
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

    public fixed?: boolean

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
