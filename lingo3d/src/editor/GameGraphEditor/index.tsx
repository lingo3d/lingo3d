import { EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import { setGameGraph } from "../../states/useGameGraph"
import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import Library from "../Library"
import Stage from "./Stage"

const GameGraphEditor = () => {
    useInitCSS()
    useInitEditor()

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
                <Stage />
                <div
                    style={{
                        height: "100%",
                        width: LIBRARY_WIDTH,
                        position: "absolute",
                        right: 0
                    }}
                >
                    <Library />
                </div>
            </div>
        </>
    )
}
export default GameGraphEditor
