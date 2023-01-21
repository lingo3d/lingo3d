import { centroid3d } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { Reactive } from "@lincode/reactivity"
import { Vector3, Quaternion } from "three"
import MeshAppendable from "../../api/core/MeshAppendable"
import mainCamera from "../../engine/mainCamera"
import scene from "../../engine/scene"
import { TransformControlsPhase } from "../../events/onTransformControls"
import IJointBase from "../../interface/IJointBase"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getPhysXLoaded } from "../../states/usePhysXLoaded"
import { getWorldPlayComputed } from "../../states/useWorldPlayComputed"
import getPrivateValue from "../../utils/getPrivateValue"
import PhysicsObjectManager from "./PhysicsObjectManager"
import destroy from "./PhysicsObjectManager/physx/destroy"
import { physxPtr } from "./PhysicsObjectManager/physx/physxPtr"
import {
    setPxTransform_,
    setPxTransform__
} from "./PhysicsObjectManager/physx/pxMath"
import PositionedDirectionedManager from "./PositionedDirectionedManager"
import { getMeshManagerSets } from "./StaticObjectManager"
import { addSelectionHelper } from "./StaticObjectManager/raycast/selectionCandidates"
import HelperSphere from "./utils/HelperSphere"

export default abstract class JointBase
    extends PositionedDirectionedManager
    implements IJointBase
{
    private fromManager?: PhysicsObjectManager
    private toManager?: PhysicsObjectManager

    protected abstract createJoint(
        fromPxTransfrom: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ): any

    public pxJoint: any

    public constructor() {
        super()
        import("./PhysicsObjectManager/physx")

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
            sphere.depthTest = false
            const handle = addSelectionHelper(sphere, this)

            sphere.onTranslateControl = (phase) =>
                phase === "end" && this.setManualPosition()

            return () => {
                handle.cancel()
            }
        }, [getCameraRendered])

        this.createEffect(() => {
            const { _to, _from } = this
            if (!physxPtr[0].physics || !_to || !_from) return

            const [[toManager]] = getMeshManagerSets(_to)
            const [[fromManager]] = getMeshManagerSets(_from)
            if (
                !(toManager instanceof PhysicsObjectManager) ||
                !(fromManager instanceof PhysicsObjectManager)
            )
                return

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
                if (phase === "start") scene.attach(this.outerObject3d)
                else if (phase === "end") this.refreshState.set({})
            }
            fromManager.onTranslateControl =
                fromManager.onRotateControl =
                fromManager.onScaleControl =
                toManager.onTranslateControl =
                toManager.onRotateControl =
                toManager.onScaleControl =
                    onMove

            const handle = new Cancellable()
            const timeout = setTimeout(() => {
                const p = this.position
                const q = this.quaternion

                const fromScale = fromManager.outerObject3d.scale
                const toScale = toManager.outerObject3d.scale

                fromManager.outerObject3d.attach(this.outerObject3d)
                const fromPxTransform = setPxTransform__(
                    p.x * fromScale.x,
                    p.y * fromScale.y,
                    p.z * fromScale.z,
                    q.x,
                    q.y,
                    q.z,
                    q.w
                )
                toManager.outerObject3d.attach(this.outerObject3d)
                const toPxTransform = setPxTransform_(
                    p.x * toScale.x,
                    p.y * toScale.y,
                    p.z * toScale.z,
                    q.x,
                    q.y,
                    q.z,
                    q.w
                )
                const joint = (this.pxJoint = this.createJoint(
                    fromPxTransform,
                    toPxTransform,
                    fromManager,
                    toManager
                ))
                handle.then(() => {
                    this.pxJoint = undefined
                    destroy(joint)
                })
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
                scene.attach(this.outerObject3d)
                this.fromManager = undefined
                this.toManager = undefined
            }
        }, [this.refreshState.get, getPhysXLoaded])
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

    protected refreshState = new Reactive({})

    private _to?: string | MeshAppendable
    public get to() {
        return this._to
    }
    public set to(val) {
        this._to = val
        this.refreshState.set({})
    }

    private _from?: string | MeshAppendable
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
}
