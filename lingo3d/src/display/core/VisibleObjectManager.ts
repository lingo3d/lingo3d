import { applyMixins } from "@lincode/utils"
import { Object3D } from "three"
import IVisibleObjectManager from "../../interface/IVisibleObjectManager"
import MixinType from "./mixins/utils/MixinType"
import VisibleMixin from "./mixins/VisibleMixin"
import GimbalObjectManager from "./GimbalObjectManager"

abstract class VisibleObjectManager<T extends Object3D = Object3D>
    extends GimbalObjectManager<T>
    implements IVisibleObjectManager
{
    public get innerVisible() {
        return this.object3d.visible
    }
    public set innerVisible(val) {
        this.object3d.visible = val
    }
}

interface VisibleObjectManager<T extends Object3D = Object3D>
    extends GimbalObjectManager<T>,
        MixinType<VisibleMixin<T>> {}
applyMixins(VisibleObjectManager, [VisibleMixin])
export default VisibleObjectManager
