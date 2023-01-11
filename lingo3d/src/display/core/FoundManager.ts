import { applyMixins } from "@lincode/utils"
import { BufferGeometry, Mesh, MeshStandardMaterial, Object3D } from "three"
import IFoundManager, {
    foundManagerDefaults,
    foundManagerSchema
} from "../../interface/IFoundManager"
import Model from "../Model"
import IVisible from "../../interface/IVisible"
import VisibleMixin from "./mixins/VisibleMixin"
import SimpleObjectManager from "./SimpleObjectManager"
import { appendableRoot } from "../../api/core/collections"
import callPrivateMethod from "../../utils/callPrivateMethod"
import { setManager } from "../../api/utils/manager"
import TextureManager from "./TextureManager"

class FoundManager extends SimpleObjectManager implements IFoundManager {
    public static componentName = "find"
    public static defaults = foundManagerDefaults
    public static schema = foundManagerSchema

    public constructor(
        mesh: Object3D | Mesh<BufferGeometry, MeshStandardMaterial>
    ) {
        super(mesh)
        appendableRoot.delete(this)

        if ("material" in mesh) {
            console.log(mesh.userData.TextureManager)
        }
    }

    public model?: Model
    private retargetAnimations() {
        const state = this.model && callPrivateMethod(this.model, "lazyStates")
        if (!state) return

        const {
            onFinishState,
            repeatState,
            managerRecordState,
            finishEventState
        } = state
        for (const animationManager of Object.values(managerRecordState.get()))
            this.animations[animationManager.name] = this.watch(
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
    protected override addToRaycastSet(set: Set<Object3D>) {
        if (!this.managerSet) {
            this.managerSet = true
            this.object3d.traverse((child) => setManager(child, this))
        }
        return super.addToRaycastSet(set)
    }
}
interface FoundManager extends SimpleObjectManager, TextureManager, IVisible {}
applyMixins(FoundManager, [VisibleMixin, TextureManager])
export default FoundManager
