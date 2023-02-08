import { applyMixins } from "@lincode/utils"
import { Object3D } from "three"
import MeshAppendable from "../../api/core/MeshAppendable"
import { onRenderHalfRate } from "../../events/onRenderHalfRate"
import IVisibleObjectManager from "../../interface/IVisibleObjectManager"
import renderSystem from "../../utils/renderSystem"
import getActualScale from "../utils/getActualScale"
import getWorldPosition from "../utils/getWorldPosition"
import MixinType from "./mixins/utils/MixinType"
import VisibleMixin from "./mixins/VisibleMixin"
import ObjectManager from "./ObjectManager"

const roundBin = (maxScale: number) => Math.round(maxScale / 50) * 50

const [addSpatialBinSystem, deleteSpatialBinSystem] = renderSystem(
    (target: MeshAppendable) => {
        const scale = getActualScale(target)
        const maxScale = roundBin(Math.max(scale.x, scale.y, scale.z))

        const center = getWorldPosition(target.outerObject3d)
        const x = roundBin(center.x)
        const y = roundBin(center.y)
        const z = roundBin(center.z)

        const xMin = x - maxScale
        const xMax = x + maxScale
        const yMin = y - maxScale
        const yMax = y + maxScale
        const zMin = z - maxScale
        const zMax = z + maxScale

        // return <const>[xMin, xMax, yMin, yMax, zMin, zMax]
    },
    onRenderHalfRate
)

abstract class VisibleObjectManager<T extends Object3D = Object3D>
    extends ObjectManager<T>
    implements IVisibleObjectManager
{
    public constructor() {
        super()
        addSpatialBinSystem(this)
    }

    protected override _dispose() {
        super._dispose()
        deleteSpatialBinSystem(this)
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
