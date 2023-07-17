import { Vector3, Quaternion } from "three"
import IJointBase from "../../interface/IJointBase"
import { getEditorBehavior } from "../../states/useEditorBehavior"
import { flushMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import PhysicsObjectManager from "./PhysicsObjectManager"
import HelperSphere from "./helperPrimitives/HelperSphere"
import { jointSet } from "../../collections/jointSet"
import MeshAppendable from "./MeshAppendable"
import { editorBehaviorPtr } from "../../pointers/editorBehaviorPtr"
import { configJointSystem } from "../../systems/configSystems/configJointSystem"
import { getWorldMode } from "../../states/useWorldMode"
import { worldModePtr } from "../../pointers/worldModePtr"
import { configPhysicsTransformSystem } from "../../systems/configSystems/configPhysicsTransformSystem"
import { helperSystem } from "../../systems/eventSystems/helperSystem"
import { configHelperSystem } from "../../systems/configSystems/configHelperSystem"

export default abstract class JointBase
    extends MeshAppendable
    implements IJointBase
{
    public $fromManager?: PhysicsObjectManager
    public $toManager?: PhysicsObjectManager

    public abstract $createJoint(
        fromPxTransfrom: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ): any

    public $pxJoint: any

    protected override disposeNode() {
        super.disposeNode()
        jointSet.delete(this)
    }

    public $createHelper() {
        const helper = new HelperSphere(this)
        helper.scale = 0.1
        helper.depthTest = false
        return helper
    }

    public constructor() {
        super()
        jointSet.add(this)
        helperSystem.add(this)
        configHelperSystem.add(this)

        this.createEffect(() => {
            if (worldModePtr[0] !== "default" || !editorBehaviorPtr[0]) return
            flushMultipleSelectionTargets(() => this.savePos())
            return () => {
                flushMultipleSelectionTargets(() => this.restorePos())
            }
        }, [getWorldMode, getEditorBehavior])
    }

    private fromPos: Vector3 | undefined
    private toPos: Vector3 | undefined
    private fromQuat: Quaternion | undefined
    private toQuat: Quaternion | undefined

    private savePos() {
        const { $fromManager: fromManager, $toManager: toManager } = this
        if (!fromManager || !toManager) return

        this.fromPos = fromManager.position.clone()
        this.toPos = toManager.position.clone()
        this.fromQuat = fromManager.quaternion.clone()
        this.toQuat = toManager.quaternion.clone()
    }
    private restorePos() {
        const { $fromManager: fromManager, $toManager: toManager } = this
        if (!fromManager || !toManager) return

        this.fromPos && fromManager.position.copy(this.fromPos)
        this.toPos && toManager.position.copy(this.toPos)
        this.fromQuat && fromManager.quaternion.copy(this.fromQuat)
        this.toQuat && toManager.quaternion.copy(this.toQuat)

        configJointSystem.add(this)
        configPhysicsTransformSystem.add(fromManager)
        configPhysicsTransformSystem.add(toManager)
    }

    private _to?: string
    public get to() {
        return this._to
    }
    public set to(val) {
        this._to = val
        configJointSystem.add(this)
    }

    private _from?: string
    public get from() {
        return this._from
    }
    public set from(val) {
        this._from = val
        configJointSystem.add(this)
    }
}
