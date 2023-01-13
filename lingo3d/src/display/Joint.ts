import { centroid3d, deg2Rad } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { Reactive } from "@lincode/reactivity"
import { Quaternion, Vector3 } from "three"
import mainCamera from "../engine/mainCamera"
import { TransformControlsPhase } from "../events/onTransformControls"
import IJoint, { jointDefaults, jointSchema } from "../interface/IJoint"
import { getCameraRendered } from "../states/useCameraRendered"
import { getPhysX } from "../states/usePhysX"
import getPrivateValue from "../utils/getPrivateValue"
import MeshManager from "./core/MeshManager"
import PhysicsObjectManager from "./core/PhysicsObjectManager"
import destroy from "./core/PhysicsObjectManager/physx/destroy"
import {
    setPxTransform,
    setPxTransform_
} from "./core/PhysicsObjectManager/physx/pxMath"
import PositionedManager from "./core/PositionedManager"
import { getMeshManagerSets } from "./core/StaticObjectManager"
import { addSelectionHelper } from "./core/StaticObjectManager/raycast/selectionCandidates"
import HelperSphere from "./core/utils/HelperSphere"
import { getWorldPlayComputed } from "../states/useWorldPlayComputed"
import scene from "../engine/scene"

const createLimitedSpherical = (
    actor0: any,
    pose0: any,
    actor1: any,
    pose1: any,
    yLimitAngle: number,
    zLimitAngle: number
) => {
    const { physics, Px, PxJointLimitCone, PxSphericalJointFlagEnum } =
        getPhysX()

    const joint = Px.SphericalJointCreate(physics, actor0, pose0, actor1, pose1)
    const cone = new PxJointLimitCone(
        yLimitAngle * deg2Rad,
        zLimitAngle * deg2Rad,
        0.05
    )
    joint.setLimitCone(cone)
    destroy(cone)
    joint.setSphericalJointFlag(PxSphericalJointFlagEnum.eLIMIT_ENABLED(), true)
    return joint
}

export default class Joint extends PositionedManager implements IJoint {
    public static componentName = "joint"
    public static defaults = jointDefaults
    public static schema = jointSchema

    private fromManager?: PhysicsObjectManager
    private toManager?: PhysicsObjectManager

    public constructor() {
        super()
        import("./core/PhysicsObjectManager/physx")

        this.yLimitAngle = 30
        this.zLimitAngle = 30

        this.createEffect(() => {
            if (!getWorldPlayComputed()) return
            this.savePos()
            return () => {
                this.restorePos()
            }
        }, [getWorldPlayComputed])

        this.createEffect(() => {
            if (getCameraRendered() !== mainCamera) return

            const sphere = new HelperSphere()
            sphere.scale = 0.1
            const handle = addSelectionHelper(sphere, this)

            sphere.onTranslateControl = (phase) =>
                phase === "end" && this.setManualPosition()

            return () => {
                handle.cancel()
            }
        }, [getCameraRendered])

        this.createEffect(() => {
            const { physics } = getPhysX()
            const { _to, _from } = this
            if (!physics || !_to || !_from) return

            const [[toManager]] = getMeshManagerSets(_to)
            const [[fromManager]] = getMeshManagerSets(_from)
            if (
                !(toManager instanceof PhysicsObjectManager) ||
                !(fromManager instanceof PhysicsObjectManager)
            )
                return

            const { parent } = this.outerObject3d
            !this.manualPosition &&
                Object.assign(this, centroid3d([fromManager, toManager]))

            fromManager.jointCount++
            toManager.jointCount++

            let fromPhysics = fromManager.physics
            const handle0 = getPrivateValue(
                fromManager,
                "refreshPhysicsState"
            )!.get(() => {
                if (fromPhysics === fromManager.physics) return
                fromPhysics = fromManager.physics
                this.refreshState.set({})
            })
            let toPhysics = toManager.physics
            const handle1 = getPrivateValue(
                toManager,
                "refreshPhysicsState"
            )!.get(() => {
                if (toPhysics === toManager.physics) return
                toPhysics = toManager.physics
                this.refreshState.set({})
            })

            const onMove = (phase: TransformControlsPhase) => {
                if (phase === "start") parent!.attach(this.outerObject3d)
                else if (phase === "end") this.refreshState.set({})
            }
            fromManager.onTranslateControl = onMove
            toManager.onTranslateControl = onMove

            const handle = new Cancellable()
            const timeout = setTimeout(() => {
                const p = this.position
                const q = this.quaternion

                const fromScale = fromManager.outerObject3d.scale
                const toScale = toManager.outerObject3d.scale

                fromManager.outerObject3d.attach(this.outerObject3d)
                const pxTransform = setPxTransform(
                    p.x * fromScale.x,
                    p.y * fromScale.y,
                    p.z * fromScale.z,
                    q.x,
                    q.y,
                    q.z,
                    q.w
                )
                toManager.outerObject3d.attach(this.outerObject3d)
                const pxTransform_ = setPxTransform_(
                    p.x * toScale.x,
                    p.y * toScale.y,
                    p.z * toScale.z,
                    q.x,
                    q.y,
                    q.z,
                    q.w
                )
                const joint = createLimitedSpherical(
                    fromManager.actor,
                    pxTransform,
                    toManager.actor,
                    pxTransform_,
                    this._yLimitAngle,
                    this._zLimitAngle
                )
                handle.then(() => destroy(joint))
            })

            this.fromManager = fromManager
            this.toManager = toManager

            return () => {
                clearTimeout(timeout)
                handle0.cancel()
                handle1.cancel()
                fromManager.onTranslateControl = undefined
                toManager.onTranslateControl = undefined
                handle.cancel()
                fromManager.jointCount--
                toManager.jointCount--
                parent!.attach(this.outerObject3d)
                this.fromManager = undefined
                this.toManager = undefined
            }
        }, [this.refreshState.get, getPhysX])
    }

    private fromPos: Vector3 | undefined
    private toPos: Vector3 | undefined
    private thisPos: Vector3 | undefined
    private fromQuat: Quaternion | undefined
    private toQuat: Quaternion | undefined
    private thisQuat: Quaternion | undefined

    private savePos() {
        const { fromManager, toManager } = this
        if (!fromManager || !toManager) return

        this.fromPos = fromManager.position.clone()
        this.toPos = toManager.position.clone()
        this.fromQuat = fromManager.quaternion.clone()
        this.toQuat = toManager.quaternion.clone()

        const { parent } = this.outerObject3d
        scene.attach(this.outerObject3d)
        this.thisPos = this.position.clone()
        this.thisQuat = this.quaternion.clone()
        parent?.attach(this.outerObject3d)
    }
    private restorePos() {
        const { fromManager, toManager } = this
        if (!fromManager || !toManager) return

        this.fromPos && fromManager.position.copy(this.fromPos)
        this.toPos && toManager.position.copy(this.toPos)
        this.fromQuat && fromManager.quaternion.copy(this.fromQuat)
        this.toQuat && toManager.quaternion.copy(this.toQuat)

        const { parent } = this.outerObject3d
        scene.attach(this.outerObject3d)
        this.thisPos && this.position.copy(this.thisPos)
        this.thisQuat && this.quaternion.copy(this.thisQuat)
        parent?.attach(this.outerObject3d)

        this.refreshState.set({})
        fromManager.updatePhysics()
        toManager.updatePhysics()
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

    private manualPosition?: boolean
    private setManualPosition() {
        this.manualPosition = true
        this.refreshState.set({})
    }

    public override get x() {
        return super.x
    }
    public override set x(val) {
        super.x = val
        this.setManualPosition()
    }

    public override get y() {
        return super.y
    }
    public override set y(val) {
        super.y = val
        this.setManualPosition()
    }

    public override get z() {
        return super.z
    }
    public override set z(val) {
        super.z = val
        this.setManualPosition()
    }

    private _yLimitAngle = 360
    public get yLimitAngle() {
        return this._yLimitAngle
    }
    public set yLimitAngle(val) {
        this._yLimitAngle = val
        this.refreshState.set({})
    }

    private _zLimitAngle = 360
    public get zLimitAngle() {
        return this._zLimitAngle
    }
    public set zLimitAngle(val) {
        this._zLimitAngle = val
        this.refreshState.set({})
    }
}
