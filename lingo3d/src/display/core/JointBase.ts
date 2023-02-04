import { centroid3d } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import { extendFunction, omitFunction } from "@lincode/utils"
import { Vector3, Quaternion, Object3D } from "three"
import { TransformControlsPhase } from "../../events/onTransformControls"
import IJointBase from "../../interface/IJointBase"
import { getEditorBehavior } from "../../states/useEditorBehavior"
import { getEditorHelper } from "../../states/useEditorHelper"
import { flushMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
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

export const joints = new Set<JointBase>()

const getRelativeTransform = (
    thisObject: Object3D,
    fromObject: Object3D,
    setPxTransform: typeof setPxTransform_
) => {
    const fromScale = fromObject.scale
    const clone = new Object3D()
    clone.position.copy(thisObject.position)
    clone.quaternion.copy(thisObject.quaternion)
    fromObject.attach(clone)
    const fromPxTransform = setPxTransform(
        clone.position.x * fromScale.x,
        clone.position.y * fromScale.y,
        clone.position.z * fromScale.z,
        clone.quaternion.x,
        clone.quaternion.y,
        clone.quaternion.z,
        clone.quaternion.w
    )
    fromObject.remove(clone)
    return fromPxTransform
}

export default abstract class JointBase
    extends PositionedDirectionedManager
    implements IJointBase
{
    public fromManager?: PhysicsObjectManager
    public toManager?: PhysicsObjectManager

    protected abstract createJoint(
        fromPxTransfrom: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ): any

    public pxJoint: any

    protected override _dispose() {
        super._dispose()
        joints.delete(this)
    }

    public constructor() {
        super()
        import("./PhysicsObjectManager/physx")

        joints.add(this)

        this.createEffect(() => {
            if (!getWorldPlayComputed() || !getEditorBehavior()) return
            flushMultipleSelectionTargets(() => this.savePos())
            return () => {
                flushMultipleSelectionTargets(() => this.restorePos())
            }
        }, [getWorldPlayComputed, getEditorBehavior])

        this.createEffect(() => {
            if (!getEditorHelper() || getWorldPlayComputed()) return

            const sphere = new HelperSphere()
            sphere.scale = 0.1
            sphere.depthTest = false
            const handle = addSelectionHelper(sphere, this)

            sphere.onTransformControls = (phase, mode) =>
                mode === "translate" &&
                phase === "end" &&
                this.setManualPosition()

            return () => {
                handle.cancel()
            }
        }, [getEditorHelper, getWorldPlayComputed])

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

            const cb = (phase: TransformControlsPhase) => {
                if (phase === "end") this.refreshState.set({})
            }
            const fromCaller = (fromManager.onTransformControls =
                extendFunction(fromManager.onTransformControls, cb))
            const toCaller = (toManager.onTransformControls = extendFunction(
                toManager.onTransformControls,
                cb
            ))

            const joint = (this.pxJoint = this.createJoint(
                getRelativeTransform(
                    this.outerObject3d,
                    fromManager.outerObject3d,
                    setPxTransform_
                ),
                getRelativeTransform(
                    this.outerObject3d,
                    toManager.outerObject3d,
                    setPxTransform__
                ),
                fromManager,
                toManager
            ))

            this.fromManager = fromManager
            this.toManager = toManager

            return () => {
                handle0.cancel()
                handle1.cancel()
                omitFunction(fromCaller, cb)
                omitFunction(toCaller, cb)
                this.pxJoint = undefined
                destroy(joint)
                fromManager.jointCount--
                toManager.jointCount--
                this.fromManager = undefined
                this.toManager = undefined
            }
        }, [this.refreshState.get, getPhysXLoaded])
    }

    private fromPos: Vector3 | undefined
    private toPos: Vector3 | undefined
    private fromQuat: Quaternion | undefined
    private toQuat: Quaternion | undefined

    private savePos() {
        const { fromManager, toManager } = this
        if (!fromManager || !toManager) return

        this.fromPos = fromManager.position.clone()
        this.toPos = toManager.position.clone()
        this.fromQuat = fromManager.quaternion.clone()
        this.toQuat = toManager.quaternion.clone()
    }
    private restorePos() {
        const { fromManager, toManager } = this
        if (!fromManager || !toManager) return

        this.fromPos && fromManager.position.copy(this.fromPos)
        this.toPos && toManager.position.copy(this.toPos)
        this.fromQuat && fromManager.quaternion.copy(this.fromQuat)
        this.toQuat && toManager.quaternion.copy(this.toQuat)

        this.refreshState.set({})
        fromManager.updatePhysics()
        toManager.updatePhysics()
    }

    public name?: string

    protected refreshState = new Reactive({})

    private _to?: string | PhysicsObjectManager
    public get to() {
        return this._to
    }
    public set to(val) {
        this._to = val
        this.refreshState.set({})
    }

    private _from?: string | PhysicsObjectManager
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
