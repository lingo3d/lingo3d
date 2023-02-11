import { useEffect, useState } from "preact/hooks"
import { loop } from "../../engine/eventLoop"
import { EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import { getGameGraph, setGameGraph } from "../../states/useGameGraph"
import { getGameGraphData } from "../../states/useGameGraphData"
import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import treeContext from "../component/treeItems/treeContext"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import useResizeObserver from "../hooks/useResizeObserver"
import useSyncState from "../hooks/useSyncState"
import mousePosition from "../utils/mousePosition"
import Node from "./Node"

const GameGraphEditor = () => {
    useInitCSS()
    useInitEditor()

    const [dragging, setDragging] = useState(false)
    const [tx, setTx] = useState(0)
    const [ty, setTy] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [ref, { width, height }] = useResizeObserver()
    const originX = width * 0.5
    const originY = height * 0.5

    useEffect(() => {
        if (!dragging) return
        const { x, y } = mousePosition

        const handle = loop(() => {
            const diffX = mousePosition.x - x
            const diffY = mousePosition.y - y
            setTx(tx + diffX)
            setTy(ty + diffY)
        })
        return () => {
            handle.cancel()
        }
    }, [dragging])

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
                    ref={ref}
                    style={{ flexGrow: 1, overflow: "hidden" }}
                    onMouseDown={() => setDragging(true)}
                    onMouseUp={() => setDragging(false)}
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
                    onDrop={(e) => {}}
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
                            <Node key={uuid} uuid={uuid} data={data} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
export default GameGraphEditor
