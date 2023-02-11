import { EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import { setGameGraph } from "../../states/useGameGraph"
import { getGameGraphData } from "../../states/useGameGraphData"
import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import useSyncState from "../hooks/useSyncState"

const GameGraph = () => {
    useInitCSS()
    useInitEditor()

    const [gameGraphData] = useSyncState(getGameGraphData)

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
                    {Object.entries(gameGraphData ?? {}).map(
                        ([uuid, { x, y }]) => (
                            <div
                                key={uuid}
                                style={{
                                    width: 200,
                                    height: 300,
                                    background: "rgba(255, 255, 255, 0.1)",
                                    position: "absolute",
                                    left: x,
                                    top: y
                                }}
                            />
                        )
                    )}
                </div>
            </div>
        </>
    )
}
export default GameGraph
