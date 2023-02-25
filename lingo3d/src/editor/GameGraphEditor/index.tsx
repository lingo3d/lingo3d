import { useSignal } from "@preact/signals"
import { useEffect } from "preact/hooks"
import Appendable from "../../api/core/Appendable"
import { EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import { setGameGraph } from "../../states/useGameGraph"
import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import Stage from "./Stage"
import GameGraphLibrary from "./GameGraphLibrary"
import GameGraphEditPanel from "./GameGraphEditPanel"

const GameGraphEditor = () => {
    useInitCSS()
    useInitEditor()

    const showLibrarySignal = useSignal(true)
    const selectedSignal = useSignal<string | undefined>(undefined)
    const targetSignal = useSignal<Appendable | undefined>(undefined)

    useEffect(() => {
        const timeout = setTimeout(() => (showLibrarySignal.value = false), 500)
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    return (
        <>
            <div
                className="lingo3d-ui lingo3d-bg lingo3d-editor lingo3d-flexcol"
                style={{ width: EDITOR_WIDTH + LIBRARY_WIDTH }}
            >
                <AppBar>
                    <CloseableTab
                        selectedSignal={selectedSignal}
                        onClose={() => setGameGraph(undefined)}
                    >
                        GameGraph
                    </CloseableTab>
                </AppBar>
                <Stage
                    onPanStart={() => (showLibrarySignal.value = false)}
                    onEdit={(target) => (targetSignal.value = target)}
                />
                <GameGraphLibrary showSignal={showLibrarySignal} />
                <GameGraphEditPanel targetSignal={targetSignal} />
            </div>
        </>
    )
}
export default GameGraphEditor
