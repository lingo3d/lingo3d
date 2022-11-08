import { applyMixins } from "@lincode/utils"
import { Object3D } from "three"
import IFoundManager, {
    foundManagerDefaults,
    foundManagerSchema
} from "../../interface/IFoundManager"
import TexturedBasicMixin from "./mixins/TexturedBasicMixin"
import TexturedStandardMixin from "./mixins/TexturedStandardMixin"
import Model from "../Model"
import IVisible from "../../interface/IVisible"
import VisibleMixin from "./mixins/VisibleMixin"
import SimpleObjectManager from "./SimpleObjectManager"
import { appendableRoot } from "../../api/core/collections"

class FoundManager extends SimpleObjectManager implements IFoundManager {
    public static componentName = "find"
    public static defaults = foundManagerDefaults
    public static schema = foundManagerSchema

    public constructor(mesh: Object3D) {
        super(mesh)
        appendableRoot.delete(this)
        const { materialManager } = mesh.userData
        materialManager && this.append(materialManager)
    }

    public model?: Model
    private retargetAnimations() {
        if (!this.model?.animationManagers) return
        for (const animationManager of Object.values(
            this.model.animationManagers
        ))
            this.animations[animationManager.name] = this.watch(
                animationManager.retarget(this.nativeObject3d)
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
            this.nativeObject3d.traverse(
                (child) => (child.userData.manager = this)
            )
        }
        return super.addToRaycastSet(set)
    }
}
interface FoundManager
    extends SimpleObjectManager,
        TexturedBasicMixin,
        TexturedStandardMixin,
        IVisible {}
applyMixins(FoundManager, [
    VisibleMixin,
    TexturedStandardMixin,
    TexturedBasicMixin
])
export default FoundManager
