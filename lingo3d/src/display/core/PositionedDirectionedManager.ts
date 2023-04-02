import { Object3D } from "three"
import scene from "../../engine/scene"
import MeshAppendable from "../../api/core/MeshAppendable"
import DirectionedMixin from "./mixins/DirectionedMixin"
import { applyMixins } from "@lincode/utils"
import IPositionedDirectionedManager from "../../interface/IPositionedDirectionedManager"

abstract class PositionedDirectionedManager<T extends Object3D = Object3D>
    extends MeshAppendable<T>
    implements IPositionedDirectionedManager
{
    public constructor(outerObject3d: T = new Object3D() as T) {
        super(outerObject3d)
        scene.add(outerObject3d)
    }
}
interface PositionedDirectionedManager<T extends Object3D = Object3D>
    extends MeshAppendable<T>,
        DirectionedMixin<T> {}
applyMixins(PositionedDirectionedManager, [DirectionedMixin])
export default PositionedDirectionedManager
