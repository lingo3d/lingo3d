import { useEffect, useState } from "preact/hooks"
import { APPBAR_HEIGHT, EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import { setGameGraph } from "../../states/useGameGraph"
import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import Library from "../Library"
import LibraryIcon from "./icons/LibraryIcon"
import Stage from "./Stage"

const GameGraphEditor = () => {
    useInitCSS()
    useInitEditor()

    const [showLibrary, setShowLibrary] = useState(true)

    useEffect(() => {
        const timeout = setTimeout(() => setShowLibrary(false), 500)
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
                    <CloseableTab onClose={() => setGameGraph(undefined)}>
                        GameGraph
                    </CloseableTab>
                </AppBar>
                <Stage onPanStart={() => setShowLibrary(false)} />
                <div
                    style={{
                        height: "100%",
                        width: LIBRARY_WIDTH,
                        position: "absolute",
                        right: 0,
                        transition: "transform 500ms",
                        transform: `translateX(${showLibrary ? 0 : 100}%)`
                    }}
                >
                    <div
                        className="lingo3d-flexcenter"
                        style={{
                            width: APPBAR_HEIGHT,
                            height: APPBAR_HEIGHT + 8,
                            position: "absolute",
                            marginLeft: -APPBAR_HEIGHT,
                            opacity: 0.75
                        }}
                        onClick={() => setShowLibrary(!showLibrary)}
                    >
                        <LibraryIcon />
                    </div>
                    <Library />
                </div>
            </div>
        </>
    )
}
export default GameGraphEditor
