import { Object3D } from "three"
import scene from "../../engine/scene"
import MeshAppendable from "../../api/core/MeshAppendable"
import PositionedMixin from "./mixins/PositionedMixin"
import { applyMixins } from "@lincode/utils"

abstract class PositionedManager<
    T extends Object3D = Object3D
> extends MeshAppendable<T> {
    public constructor(outerObject3d: T = new Object3D() as T) {
        super(outerObject3d)
        scene.add(outerObject3d)
    }
}
interface PositionedManager<T extends Object3D = Object3D>
    extends MeshAppendable<T>,
        PositionedMixin<T> {}
applyMixins(PositionedManager, [PositionedMixin])
export default PositionedManager

export const isPositionedManager = (item: any): item is PositionedManager =>
    item instanceof MeshAppendable && "x" in item
