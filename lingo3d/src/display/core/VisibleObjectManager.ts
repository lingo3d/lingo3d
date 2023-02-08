import { applyMixins, forceGetInstance } from "@lincode/utils"
import { Object3D } from "three"
import MeshAppendable from "../../api/core/MeshAppendable"
import { onRenderHalfRate } from "../../events/onRenderHalfRate"
import IVisibleObjectManager from "../../interface/IVisibleObjectManager"
import renderSystemWithSetup from "../../utils/renderSystemWithSetup"
import getActualScale from "../utils/getActualScale"
import getWorldPosition from "../utils/getWorldPosition"
import MixinType from "./mixins/utils/MixinType"
import VisibleMixin from "./mixins/VisibleMixin"
import ObjectManager from "./ObjectManager"

const binSize = 10

const roundBin = (maxScale: number) => Math.round(maxScale / binSize) * binSize
const binKeyManagerMap = new Map<string, Array<VisibleObjectManager>>()

const [addSpatialBinSystem, deleteSpatialBinSystem] = renderSystemWithSetup(
    (target: MeshAppendable) => {
        const scale = getActualScale(target)
        const center = getWorldPosition(target.outerObject3d)
        const maxScale = roundBin(Math.max(scale.x, scale.y, scale.z))

        const x = roundBin(center.x)
        const y = roundBin(center.y)
        const z = roundBin(center.z)

        const xMin = x - maxScale
        const xMax = x + maxScale
        const yMin = y - maxScale
        const yMax = y + maxScale
        const zMin = z - maxScale
        const zMax = z + maxScale

        forceGetInstance(
            binKeyManagerMap,
            `${xMin};${xMax};${yMin};${yMax};${zMin};${zMax}`,
            Array<MeshAppendable>
        ).push(target)
    },
    () => {
        console.log([...binKeyManagerMap])
        binKeyManagerMap.clear()
    },
    onRenderHalfRate
)
export { deleteSpatialBinSystem }

abstract class VisibleObjectManager<T extends Object3D = Object3D>
    extends ObjectManager<T>
    implements IVisibleObjectManager
{
    public constructor(object3d?: T, unmounted?: boolean) {
        super(object3d, unmounted)
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
