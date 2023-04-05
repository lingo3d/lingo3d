import { applyMixins } from "@lincode/utils"
import { Object3D } from "three"
import IFoundManager, {
    foundManagerDefaults,
    foundManagerSchema
} from "../../interface/IFoundManager"
import Model from "../Model"
import VisibleMixin from "./mixins/VisibleMixin"
import SimpleObjectManager from "./SimpleObjectManager"
import { setManager } from "../../api/utils/getManager"
import TextureManager from "./TextureManager"
import MeshAppendable from "../../api/core/MeshAppendable"
import {
    standardDefaultParams,
    standardDefaults,
    StandardMesh
} from "./mixins/TexturedStandardMixin"
import MixinType from "./mixins/utils/MixinType"
import { Cancellable } from "@lincode/promiselikes"

class FoundManager extends SimpleObjectManager implements IFoundManager {
    public static componentName = "find"
    public static defaults = foundManagerDefaults
    public static schema = foundManagerSchema

    public constructor(
        mesh: Object3D | StandardMesh,
        public owner: MeshAppendable
    ) {
        super(mesh, true)
        owner.appendNode(this)

        if (!("material" in mesh)) {
            this.defaults = standardDefaults
            this.defaultParams = standardDefaultParams
            return
        }
        const { defaults, defaultParams, addRefreshParamsSystem } = mesh
            .material.userData.TextureManager as typeof TextureManager
        this.defaults = defaults
        this.defaultParams = defaultParams
        this.addRefreshParamsSystem = addRefreshParamsSystem
    }

    public model?: Model
    private retargetAnimations() {
        const state = this.model?.lazyStates()
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
        this.model = undefined
    }

    public override get animation() {
        return super.animation
    }
    public override set animation(val) {
        this.retargetAnimations()
        super.animation = val
    }

    private managerSet?: boolean
    public addToRaycastSet(set: Set<Object3D>) {
        if (!this.managerSet) {
            this.managerSet = true
            this.object3d.traverse((child) => setManager(child, this))
        }
        set.add(this.object3d)
        return new Cancellable(() => set.delete(this.object3d))
    }
}
interface FoundManager
    extends SimpleObjectManager,
        TextureManager,
        MixinType<VisibleMixin> {}
applyMixins(FoundManager, [VisibleMixin, TextureManager])
export default FoundManager
