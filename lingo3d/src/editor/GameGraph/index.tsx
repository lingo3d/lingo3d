import { EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import { setGameGraph } from "../../states/useGameGraph"
import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"

const GameGraph = () => {
    useInitCSS()
    useInitEditor()

    return (
        <>
            <div
                className="lingo3d-ui lingo3d-bg lingo3d-editor"
                style={{ width: EDITOR_WIDTH + LIBRARY_WIDTH }}
            >
                <AppBar>
                    <CloseableTab onClose={() => setGameGraph(undefined)}>
                        GameGraph
                    </CloseableTab>
                </AppBar>
            </div>
        </>
    )
}
export default GameGraph
