import { Object3D } from "three"
import scene from "../../engine/scene"
import MeshAppendable from "../../api/core/MeshAppendable"
import DirectionedMixin from "./mixins/DirectionedMixin"
import { applyMixins } from "@lincode/utils"
import PositionedMixin from "./mixins/PositionedMixin"

abstract class DirectionedManager<
    T extends Object3D = Object3D
> extends MeshAppendable<T> {
    public constructor(outerObject3d: T = new Object3D() as T) {
        super(outerObject3d)
        scene.add(outerObject3d)
    }
}
interface DirectionedManager<T extends Object3D = Object3D>
    extends MeshAppendable<T>,
        DirectionedMixin<T>,
        PositionedMixin<T> {}
applyMixins(DirectionedManager, [PositionedMixin, DirectionedMixin])
export default DirectionedManager
