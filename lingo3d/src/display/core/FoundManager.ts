import { applyMixins } from "@lincode/utils"
import { Object3D } from "three"
import IFoundManager, {
    foundManagerDefaults,
    foundManagerSchema
} from "../../interface/IFoundManager"
import VisibleMixin from "./mixins/VisibleMixin"
import SimpleObjectManager from "./SimpleObjectManager"
import TexturedStandardMixin, {
    StandardMesh
} from "./mixins/TexturedStandardMixin"
import MixinType from "./mixins/utils/MixinType"
import { Cancellable } from "@lincode/promiselikes"
import type Model from "../Model"
import { MaterialParams } from "../../pools/materialPool"
import { materialDefaultsMap } from "../../collections/materialDefaultsMap"

class FoundManager extends SimpleObjectManager implements IFoundManager {
    public static componentName = "find"
    public static defaults = foundManagerDefaults
    public static schema = foundManagerSchema

    protected _materialParams?: MaterialParams
    protected _defaults?: Record<string, any>

    public constructor(mesh: Object3D | StandardMesh, owner?: Model) {
        super(mesh, true)
        owner?.appendNode(this)
        this.disableSceneGraph = true
        this.disableSerialize = true
        this._name = mesh.name

        if (!("material" in mesh)) return

        this._defaults = materialDefaultsMap.get(mesh.material)!
        this._materialParams = Object.values(this._defaults) as MaterialParams
    }

    private retargeted?: boolean
    private retargetAnimations() {
        if (this.retargeted) return

        const state = (this.parent as Model).$lazyStates()
        if (!state) return

        const {
            onFinishState,
            repeatState,
            managerRecordState,
            finishEventState
        } = state
        for (const animationManager of Object.values(managerRecordState.get()))
            this.animations[animationManager.name!] = this.watch(
                animationManager.retarget(
                    this,
                    repeatState,
                    onFinishState,
                    finishEventState
                )
            )
        this.retargeted = true
    }

    public override get animation() {
        return super.animation
    }
    public override set animation(val) {
        this.retargetAnimations()
        super.animation = val
    }

    public $addToRaycastSet(set: Set<Object3D>) {
        set.add(this.object3d)
        return new Cancellable(() => set.delete(this.object3d))
    }
}
interface FoundManager
    extends SimpleObjectManager,
        MixinType<TexturedStandardMixin>,
        MixinType<VisibleMixin> {}
applyMixins(FoundManager, [VisibleMixin, TexturedStandardMixin])
export default FoundManager
