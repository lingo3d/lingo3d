import { applyMixins } from "@lincode/utils"
import { Object3D } from "three"
import IFound, { foundDefaults, foundSchema } from "../../interface/IFound"
import TexturedBasicMixin from "./mixins/TexturedBasicMixin"
import TexturedStandardMixin from "./mixins/TexturedStandardMixin"
import { appendableRoot } from "../../api/core/Appendable"
import Model from "../Model"
import VisibleObjectManager from "./VisibleObjectManager"
import IVisible from "../../interface/IVisible"
import AnimatedObjectManager from "./AnimatedObjectManager"

class FoundManager extends AnimatedObjectManager implements IFound {
    public static componentName = "find"
    public static defaults = foundDefaults
    public static schema = foundSchema

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
    extends AnimatedObjectManager,
        TexturedBasicMixin,
        TexturedStandardMixin,
        IVisible {}
applyMixins(FoundManager, [
    VisibleObjectManager,
    TexturedStandardMixin,
    TexturedBasicMixin
])
export default FoundManager
