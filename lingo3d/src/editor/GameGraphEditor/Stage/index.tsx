import { useEffect } from "preact/hooks"
import Appendable from "../../../display/core/Appendable"
import { onDispose } from "../../../events/onDispose"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { getGameGraph } from "../../../states/useGameGraph"
import { getGameGraphData } from "../../../states/useGameGraphData"
import Connector from "../../../visualScripting/Connector"
import mergeRefs from "../../hooks/mergeRefs"
import useBoundingClientRect from "../../hooks/useBoundingClientRect"
import usePan from "../../hooks/usePan"
import useSyncState from "../../hooks/useSyncState"
import Connection from "../Connection"
import Node from "../Node"
import { stageContextMenuSignal } from "../StageContextMenu"
import {
    zoomSignal,
    boundsSignal,
    txSignal,
    tySignal,
    originSignal,
    getStagePosition
} from "./stageSignals"
import { managerConnectorsMap } from "../../../collections/managerConnectorsMap"
import { draggingItemPtr } from "../../../pointers/draggingItemPtr"

type Props = {
    onEdit?: (manager: Appendable) => void
}

const Stage = ({ onEdit }: Props) => {
    const [containerRef, bounds] = useBoundingClientRect()
    boundsSignal.value = bounds

    const pressRef = usePan({
        onPanStart: () => emitSelectionTarget(undefined),
        onPan: ({ deltaX, deltaY }) => {
            txSignal.value += deltaX
            tySignal.value += deltaY
        }
    })

    const [gameGraphData] = useSyncState(getGameGraphData)

    useEffect(() => {
        if (!gameGraphData) return
        const handle = onDispose((val) => {
            if (!(val.uuid in gameGraphData)) return
            const gameGraph = getGameGraph()!
            gameGraph.deleteData(val.uuid)
            if (val instanceof Connector) return
            for (const connector of managerConnectorsMap.get(val) ?? [])
                connector.dispose()
        })
        return () => {
            handle.cancel()
        }
    }, [])

    if (!gameGraphData) return null

    return (
        <div
            ref={mergeRefs(containerRef, pressRef)}
            style={{ flexGrow: 1, overflow: "hidden" }}
            onWheel={(e) => {
                e.preventDefault()
                const scale = Math.min(
                    Math.max(zoomSignal.value - e.deltaY * 0.001, 0.1),
                    1
                )

                const xOld =
                    ((e.clientX -
                        boundsSignal.value.left -
                        txSignal.value -
                        originSignal.value.x) /
                        zoomSignal.value +
                        originSignal.value.x) *
                    scale
                const x =
                    ((e.clientX -
                        boundsSignal.value.left -
                        txSignal.value -
                        originSignal.value.x) /
                        scale +
                        originSignal.value.x) *
                    scale
                txSignal.value += x - xOld

                const yOld =
                    ((e.clientY -
                        boundsSignal.value.top -
                        tySignal.value -
                        originSignal.value.y) /
                        zoomSignal.value +
                        originSignal.value.y) *
                    scale
                const y =
                    ((e.clientY -
                        boundsSignal.value.top -
                        tySignal.value -
                        originSignal.value.y) /
                        scale +
                        originSignal.value.y) *
                    scale
                tySignal.value += y - yOld

                zoomSignal.value = scale
            }}
            onDragOver={(e) => {
                e.preventDefault()
                if (!(draggingItemPtr[0] instanceof Appendable)) return

                getGameGraph()!.mergeData({
                    [draggingItemPtr[0].uuid]: {
                        type: "node",
                        ...getStagePosition(e.clientX, e.clientY)
                    }
                })
            }}
            onContextMenu={(e) =>
                (stageContextMenuSignal.value = { x: e.clientX, y: e.clientY })
            }
        >
            <div
                style={{
                    position: "absolute",
                    width: boundsSignal.value.width,
                    height: boundsSignal.value.height,
                    transform: `translate(${txSignal.value}px, ${tySignal.value}px) scale(${zoomSignal.value})`,
                    transformOrigin: `${originSignal.value.x}px ${originSignal.value.y}px`
                }}
            >
                {Object.entries(gameGraphData).map(([uuid, data]) =>
                    "x" in data ? (
                        <Node
                            key={uuid}
                            uuid={uuid}
                            data={data}
                            onEdit={onEdit}
                        />
                    ) : (
                        <Connection key={uuid} uuid={uuid} />
                    )
                )}
            </div>
        </div>
    )
}

export default Stage
