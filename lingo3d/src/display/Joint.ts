import { centroid3d } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import IJoint, { jointDefaults, jointSchema } from "../interface/IJoint"
import { getCameraRendered } from "../states/useCameraRendered"
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
import { addSelectionHelper } from "./core/StaticObjectManager/raycast/selectionCandidates"
import HelperSphere from "./core/utils/HelperSphere"

const createLimitedSpherical = (a0: any, t0: any, a1: any, t1: any) => {
    const { physics, Px, PxJointLimitCone, PxSphericalJointFlagEnum } =
        getPhysX()

    const j = Px.SphericalJointCreate(physics, a0, t0, a1, t1)
    j.setLimitCone(new PxJointLimitCone(Math.PI / 2, Math.PI / 2, 0.05))
    j.setSphericalJointFlag(PxSphericalJointFlagEnum.eLIMIT_ENABLED(), true)
    return j
}

export default class Joint extends PositionedManager implements IJoint {
    public static componentName = "joint"
    public static defaults = jointDefaults
    public static schema = jointSchema

    public constructor() {
        super()
        import("./core/PhysicsObjectManager/physx")

        this.createEffect(() => {
            if (getCameraRendered() !== mainCamera) return

            const sphere = new HelperSphere()
            sphere.scale = 0.1
            const handle = addSelectionHelper(sphere, this)

            sphere.onTranslateControl = () => {
                console.log(sphere)
            }

            return () => {
                handle.cancel()
            }
        }, [getCameraRendered])

        this.createEffect(() => {
            const { physics } = getPhysX()
            const { _to, _from, _fixed } = this
            if (!physics || !_to || !_from) return

            const [[toManager]] = getMeshManagerSets(_to)
            const [[fromManager]] = getMeshManagerSets(_from)
            if (
                !(toManager instanceof PhysicsObjectManager) ||
                !(fromManager instanceof PhysicsObjectManager)
            )
                return

            Object.assign(this, centroid3d([fromManager, toManager]))

            if (fromManager.physics !== true) fromManager.physics = true
            if (toManager.physics !== true) toManager.physics = true

            queueMicrotask(() => {
                if (_fixed)
                    createLimitedSpherical(
                        null,
                        setPxTransform(0, 0, 0),
                        fromManager.actor,
                        assignPxTransform_(fromManager)
                    )

                const p = this.position
                const q = this.quaternion

                fromManager.outerObject3d.attach(this.outerObject3d)
                const pxTransform = setPxTransform(
                    p.x * 0.5,
                    p.y * 0.5,
                    p.z * 0.5,
                    q.x,
                    q.y,
                    q.z,
                    q.w
                )
                toManager.outerObject3d.attach(this.outerObject3d)
                const pxTransform_ = setPxTransform_(
                    p.x * 0.5,
                    p.y * 0.5,
                    p.z * 0.5,
                    q.x,
                    q.y,
                    q.z,
                    q.w
                )
                createLimitedSpherical(
                    fromManager.actor,
                    pxTransform,
                    toManager.actor,
                    pxTransform_
                )
            })
        }, [this.refreshState.get, getPhysX])
    }

    public name?: string

    private refreshState = new Reactive({})

    private _to?: string | MeshManager
    public get to() {
        return this._to
    }
    public set to(val) {
        this._to = val
        this.refreshState.set({})
    }

    private _from?: string | MeshManager
    public get from() {
        return this._from
    }
    public set from(val) {
        this._from = val
        this.refreshState.set({})
    }

    private _fixed?: boolean
    public get fixed() {
        return this._fixed
    }
    public set fixed(val) {
        this._fixed = val
        this.refreshState.set({})
    }
}
