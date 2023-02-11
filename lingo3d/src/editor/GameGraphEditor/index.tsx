import { EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import { setGameGraph } from "../../states/useGameGraph"
import { getGameGraphData } from "../../states/useGameGraphData"
import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import useSyncState from "../hooks/useSyncState"
import Node from "./Node"

const GameGraphEditor = () => {
    useInitCSS()
    useInitEditor()

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
                <div style={{ flexGrow: 1 }}>
                    {Object.entries(gameGraphData).map(([uuid, data]) => (
                        <Node key={uuid} uuid={uuid} data={data} />
                    ))}
                </div>
            </div>
        </>
    )
}
export default GameGraphEditor
