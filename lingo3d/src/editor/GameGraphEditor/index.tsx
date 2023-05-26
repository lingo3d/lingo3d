import { useSignal } from "@preact/signals"
import Appendable from "../../display/core/Appendable"
import { EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import { setGameGraph } from "../../states/useGameGraph"
import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import Stage from "./Stage"
import GameGraphLibrary from "./GameGraphLibrary"
import GameGraphEditPanel from "./GameGraphEditPanel"
import StageContextMenu from "./StageContextMenu"
import NodeContextMenu from "./NodeContextMenu"

const GameGraphEditor = () => {
    useInitCSS()
    useInitEditor()

    const targetSignal = useSignal<Appendable | undefined>(undefined)

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
                <Stage onEdit={(target) => (targetSignal.value = target)} />
                <GameGraphLibrary />
                <GameGraphEditPanel targetSignal={targetSignal} />
            </div>
            <StageContextMenu />
            <NodeContextMenu />
        </>
    )
}
export default GameGraphEditor
