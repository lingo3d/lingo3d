import { applyMixins } from "@lincode/utils"
import { Object3D } from "three"
import IVisibleObjectManager from "../../../interface/IVisibleObjectManager"
import MixinType from "../mixins/utils/MixinType"
import VisibleMixin from "../mixins/VisibleMixin"
import ObjectManager from "../ObjectManager"

abstract class VisibleObjectManager<T extends Object3D = Object3D>
    extends ObjectManager<T>
    implements IVisibleObjectManager
{
    protected override disposeNode() {
        super.disposeNode()
        this.$disposeVisibleMixin()
    }

    public get innerVisible() {
        return this.object3d.visible
    }
    public set innerVisible(val) {
        this.object3d.visible = val
    }
}

interface VisibleObjectManager<T extends Object3D = Object3D>
    extends ObjectManager<T>,
        MixinType<VisibleMixin<T>> {}
applyMixins(VisibleObjectManager, [VisibleMixin])
export default VisibleObjectManager
