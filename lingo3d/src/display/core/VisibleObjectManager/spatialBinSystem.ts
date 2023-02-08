import { forceGetInstance } from "@lincode/utils"
import VisibleObjectManager from "."
import MeshAppendable from "../../../api/core/MeshAppendable"
import { onRenderHalfRate } from "../../../events/onRenderHalfRate"
import renderSystemWithSetup from "../../../utils/renderSystemWithSetup"
import getActualScale from "../../utils/getActualScale"
import getWorldPosition from "../../utils/getWorldPosition"

const binSize = 10

const roundBin = (maxScale: number) => Math.round(maxScale / binSize) * binSize
const binKeyManagerMap = new Map<string, Array<VisibleObjectManager>>()

export const [addSpatialBinSystem, deleteSpatialBinSystem] =
    renderSystemWithSetup(
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
