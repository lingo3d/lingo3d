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
import CharacterRig from "../CharacterRig"

class FoundManager extends SimpleObjectManager implements IFoundManager {
    public static componentName = "find"
    public static defaults = foundManagerDefaults
    public static schema = foundManagerSchema

    protected _materialParams?: MaterialParams
    protected _defaults?: Record<string, any>

    public constructor(mesh: Object3D | StandardMesh, public owner?: Model) {
        super(mesh)
        owner?.$appendNode(this)
        this.$ghost(false)
        this._name = mesh.name

        if (!("material" in mesh)) return

        this._defaults = materialDefaultsMap.get(mesh.material)
        if (!this._defaults) return

        this._materialParams = Object.values(this._defaults) as MaterialParams
    }

    private inherited?: boolean
    private inheritAnimations() {
        if (this.inherited) return
        const states = (this.parent as Model).$animationStates
        for (const animationManager of Object.values(states.managerRecord))
            this.animations[animationManager.name!] = this.watch(
                animationManager.inherit(this, states)
            )
        this.inherited = true
    }

    public override get animation() {
        return super.animation
    }
    public override set animation(val) {
        this.inheritAnimations()
        super.animation = val
    }

    public $addToRaycastSet(set: Set<Object3D>) {
        set.add(this.object3d)
        return new Cancellable(() => set.delete(this.object3d))
    }

    public $characterRig: CharacterRig | undefined
}
interface FoundManager
    extends SimpleObjectManager,
        MixinType<TexturedStandardMixin>,
        MixinType<VisibleMixin> {}
applyMixins(FoundManager, [VisibleMixin, TexturedStandardMixin])
export default FoundManager
