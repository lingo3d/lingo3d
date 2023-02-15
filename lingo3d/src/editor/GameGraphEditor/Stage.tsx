import { useState, useMemo } from "preact/hooks"
import { getGameGraph } from "../../states/useGameGraph"
import { getGameGraphData } from "../../states/useGameGraphData"
import throttleFrameLeading from "../../utils/throttleFrameLeading"
import treeContext from "../component/treeItems/treeContext"
import mergeRefs from "../hooks/mergeRefs"
import useLatest from "../hooks/useLatest"
import usePan from "../hooks/usePan"
import useResizeObserver from "../hooks/useResizeObserver"
import useSyncState from "../hooks/useSyncState"
import Connection from "./Connection"
import Node from "./Node"

type StageProps = {
    onPanStart?: () => void
}

const Stage = ({ onPanStart }: StageProps) => {
    const [tx, setTx] = useState(0)
    const [ty, setTy] = useState(0)
    const [zoom, setZoom] = useState(0.75)
    const zoomRef = useLatest(zoom)
    const [containerRef, { width, height }] = useResizeObserver()
    const originX = width * 0.5
    const originY = height * 0.5
    const pressRef = usePan({
        onPanStart,
        onPan: ({ deltaX, deltaY }) => {
            setTx((tx) => tx + deltaX)
            setTy((ty) => ty + deltaY)
        }
    })
    const getContainerBounds = useMemo(
        () =>
            throttleFrameLeading(() =>
                containerRef.current!.getBoundingClientRect()
            ),
        []
    )
    const getPosition = (e: { clientX: number; clientY: number }) => {
        const bounds = getContainerBounds()
        const x = (e.clientX - bounds.left - tx - originX) / zoom + originX
        const y = (e.clientY - bounds.top - ty - originY) / zoom + originY
        return { x, y }
    }
    const getPositionRef = useLatest(getPosition)
    const [gameGraphData] = useSyncState(getGameGraphData)
    if (!gameGraphData) return null

    return (
        <div
            ref={mergeRefs(containerRef, pressRef)}
            style={{ flexGrow: 1, overflow: "hidden" }}
            onWheel={(e) => {
                e.preventDefault()
                const scale = Math.min(
                    Math.max(zoom - e.deltaY * 0.001, 0.1),
                    1
                )
                setZoom(scale)

                const bounds = getContainerBounds()

                const xOld =
                    ((e.clientX - bounds.left - tx - originX) / zoom +
                        originX) *
                    scale
                const x =
                    ((e.clientX - bounds.left - tx - originX) / scale +
                        originX) *
                    scale

                setTx(tx + x - xOld)

                const yOld =
                    ((e.clientY - bounds.top - ty - originY) / zoom + originY) *
                    scale
                const y =
                    ((e.clientY - bounds.top - ty - originY) / scale +
                        originY) *
                    scale

                setTy(ty + y - yOld)
            }}
            onDragOver={(e) => {
                e.preventDefault()
                if (!treeContext.draggingItem) return

                getGameGraph()!.mergeData({
                    [treeContext.draggingItem.uuid]: getPosition(e)
                })
            }}
        >
            <div
                style={{
                    position: "absolute",
                    width,
                    height,
                    transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
                    transformOrigin: `${originX}px ${originY}px`
                }}
            >
                {Object.entries(gameGraphData).map(([uuid, data]) =>
                    "x" in data ? (
                        <Node
                            key={uuid}
                            uuid={uuid}
                            data={data}
                            getPositionRef={getPositionRef}
                            zoomRef={zoomRef}
                        />
                    ) : (
                        <Connection
                            key={uuid}
                            data={data}
                            getPositionRef={getPositionRef}
                        />
                    )
                )}
            </div>
        </div>
    )
}

export default Stage
