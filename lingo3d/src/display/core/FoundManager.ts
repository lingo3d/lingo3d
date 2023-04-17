import { applyMixins } from "@lincode/utils"
import { Object3D } from "three"
import IFoundManager, {
    foundManagerDefaults,
    foundManagerSchema
} from "../../interface/IFoundManager"
import VisibleMixin from "./mixins/VisibleMixin"
import SimpleObjectManager from "./SimpleObjectManager"
import TextureManager from "./TextureManager"
import {
    standardDefaultParams,
    standardDefaults,
    StandardMesh
} from "./mixins/TexturedStandardMixin"
import MixinType from "./mixins/utils/MixinType"
import { Cancellable } from "@lincode/promiselikes"
import type Model from "../Model"

class FoundManager extends SimpleObjectManager implements IFoundManager {
    public static componentName = "find"
    public static defaults = foundManagerDefaults
    public static schema = foundManagerSchema

    public constructor(mesh: Object3D | StandardMesh, private owner: Model) {
        super(mesh, true)
        owner.appendNode(this)
        this.disableSceneGraph = true
        this.disableSerialize = true
        this.name = mesh.name

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

    private retargeted?: boolean
    private retargetAnimations() {
        if (this.retargeted) return

        const state = this.owner.lazyStates()
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

    public addToRaycastSet(set: Set<Object3D>) {
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
