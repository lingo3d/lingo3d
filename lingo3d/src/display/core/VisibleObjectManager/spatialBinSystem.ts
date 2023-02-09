import { forceGetInstance } from "@lincode/utils"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { onRenderHalfRate } from "../../../events/onRenderHalfRate"
import renderSystemWithSetup from "../../../utils/renderSystemWithSetup"
import getActualScale from "../../utils/getActualScale"
import getWorldPosition from "../../utils/getWorldPosition"

const binSize = 5

type ZMaxMap = Map<number, Array<any>>
type ZMinMap = Map<number, ZMaxMap>
type YMaxMap = Map<number, ZMinMap>
type YMinMap = Map<number, YMaxMap>
type XMaxMap = Map<number, YMinMap>

const roundBin = (maxScale: number) => Math.round(maxScale / binSize) * binSize
export const xMinMap = new Map<number, XMaxMap>()

export const [addSpatialBinSystem, deleteSpatialBinSystem] =
    renderSystemWithSetup(
        (target: MeshAppendable) => {
            const scale = getActualScale(target)
            const position = getWorldPosition(target.outerObject3d)
            const maxScale = roundBin(Math.max(scale.x, scale.y, scale.z))

            const x = roundBin(position.x)
            const y = roundBin(position.y)
            const z = roundBin(position.z)

            const xMin = x - maxScale
            const xMax = x + maxScale
            const yMin = y - maxScale
            const yMax = y + maxScale
            const zMin = z - maxScale
            const zMax = z + maxScale

            const xMaxMap = forceGetInstance(
                xMinMap,
                xMin,
                Map<number, YMinMap>
            )
            const yMinMap = forceGetInstance(
                xMaxMap,
                xMax,
                Map<number, YMaxMap>
            )
            const yMaxMap = forceGetInstance(
                yMinMap,
                yMin,
                Map<number, ZMinMap>
            )
            const zMinMap = forceGetInstance(
                yMaxMap,
                yMax,
                Map<number, ZMaxMap>
            )
            const zMaxMap = forceGetInstance(
                zMinMap,
                zMin,
                Map<number, Array<any>>
            )
            forceGetInstance(zMaxMap, zMax, Array).push(target)
        },
        () => xMinMap.clear(),
        onRenderHalfRate
    )
