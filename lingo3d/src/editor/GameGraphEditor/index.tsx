import { useState } from "preact/hooks"
import { EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import { getGameGraph, setGameGraph } from "../../states/useGameGraph"
import { getGameGraphData } from "../../states/useGameGraphData"
import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import treeContext from "../component/treeItems/treeContext"
import mergeRefs from "../hooks/mergeRefs"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import useLatest from "../hooks/useLatest"
import usePan from "../hooks/usePan"
import useResizeObserver from "../hooks/useResizeObserver"
import useSyncState from "../hooks/useSyncState"
import Node from "./Node"

const GameGraphEditor = () => {
    useInitCSS()
    useInitEditor()

    const [tx, setTx] = useState(0)
    const [ty, setTy] = useState(0)
    const [zoom, setZoom] = useState(0.75)
    const latestZoom = useLatest(zoom)
    const [containerRef, { width, height }] = useResizeObserver()
    const originX = width * 0.5
    const originY = height * 0.5
    const pressRef = usePan({
        onPan: ({ deltaX, deltaY }) => {
            setTx((tx) => tx + deltaX)
            setTy((ty) => ty + deltaY)
        }
    })
    const gameGraph = useSyncState(getGameGraph)
    const [gameGraphData] = useSyncState(getGameGraphData)
    if (!gameGraphData || !gameGraph) return null

    return (
        <>
            <div
                className="lingo3d-ui lingo3d-bg lingo3d-editor lingo3d-flexcol"
                style={{ width: EDITOR_WIDTH + LIBRARY_WIDTH }}
            >
                <AppBar>
                    <CloseableTab onClose={() => setGameGraph(undefined)}>
                        GameGraph
                    </CloseableTab>
                </AppBar>
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

                        const bounds = e.currentTarget.getBoundingClientRect()

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
                            ((e.clientY - bounds.top - ty - originY) / zoom +
                                originY) *
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

                        const bounds = e.currentTarget.getBoundingClientRect()
                        const x =
                            (e.clientX - bounds.left - tx - originX) / zoom +
                            originX
                        const y =
                            (e.clientY - bounds.top - ty - originY) / zoom +
                            originY

                        gameGraph.mergeData({
                            [treeContext.draggingItem.uuid]: { x, y }
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
                        {Object.entries(gameGraphData).map(([uuid, data]) => (
                            <Node
                                key={uuid}
                                uuid={uuid}
                                data={data}
                                onPan={(e) =>
                                    gameGraph.mergeData({
                                        [uuid]: {
                                            x:
                                                data.x +
                                                e.deltaX / latestZoom.current,
                                            y:
                                                data.y +
                                                e.deltaY / latestZoom.current
                                        }
                                    })
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
export default GameGraphEditor
