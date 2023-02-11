import { useEffect, useState } from "preact/hooks"
import { loop } from "../../engine/eventLoop"
import { EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import { setGameGraph } from "../../states/useGameGraph"
import { getGameGraphData } from "../../states/useGameGraphData"
import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import useSyncState from "../hooks/useSyncState"
import mousePosition from "../utils/mousePosition"
import Node from "./Node"

const GameGraphEditor = () => {
    useInitCSS()
    useInitEditor()

    const [dragging, setDragging] = useState(false)
    const [tx, setTx] = useState(0)
    const [ty, setTy] = useState(0)

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

    const [gameGraphData] = useSyncState(getGameGraphData)
    if (!gameGraphData) return null

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
                    style={{ flexGrow: 1 }}
                    onMouseDown={() => setDragging(true)}
                    onMouseUp={() => setDragging(false)}
                >
                    <div style={{ transform: `translate(${tx}px, ${ty}px)` }}>
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
