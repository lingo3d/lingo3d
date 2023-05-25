import Toolbar from "../Toolbar"
import SceneGraph from "../SceneGraph"
import Editor from "../Editor"
import Library from "../Library"
import HUD from "../HUD"
import Stats from "../Stats"
import WorldBar from "../WorldBar"
import Panels from "../Panels"
import { DEBUG } from "../../globals"
import useSyncState from "../hooks/useSyncState"
import { getStats } from "../../states/useStats"
import DummyIKEditor from "../DummyIKEditor"
import GameGraphEditor from "../GameGraphEditor"
import { getGameGraph } from "../../states/useGameGraph"
import { getDummyIK } from "../../states/useDummyIK"
import prevent from "../utils/prevent"
import { getWorldExpanded } from "../../states/useWorldExpanded"
import Runtime from "../Runtime"
import World from "../World"
import { getEditorRuntime } from "../../states/useEditorRuntime"
import Terminal from "../Terminal"
import { useEffect } from "preact/hooks"
import MenuBar from "../MenuBar"
import { getScript } from "../../states/useScript"
import ScriptEditor from "../ScriptEditor"

const LingoEditor = () => {
    const stats = useSyncState(getStats)
    const gameGraph = useSyncState(getGameGraph)
    const script = useSyncState(getScript)
    const dummyIK = useSyncState(getDummyIK)
    const worldExpanded = useSyncState(getWorldExpanded)
    const editorRuntime = useSyncState(getEditorRuntime)

    useEffect(() => {
        document.body.classList.add("lingo3d-body")
        return () => {
            document.body.classList.remove("lingo3d-body")
        }
    }, [])

    return (
        <div
            className="lingo3d-ui lingo3d-lingoeditor lingo3d-absfull"
            onContextMenu={DEBUG ? undefined : prevent}
        >
            {!worldExpanded && (
                <>
                    <MenuBar />
                    <Toolbar />
                    <SceneGraph />
                    {dummyIK ? (
                        <DummyIKEditor />
                    ) : gameGraph ? (
                        <GameGraphEditor />
                    ) : script ? (
                        <ScriptEditor />
                    ) : (
                        <Editor />
                    )}
                    {!gameGraph && !dummyIK && <Library />}
                    {!gameGraph && !dummyIK && <Panels />}
                </>
            )}
            <WorldBar />
            <div
                className="lingo3d-world lingo3d-bg"
                style={{ height: "100%", flexGrow: 1, position: "relative" }}
            >
                {editorRuntime ? <Runtime /> : <World />}
            </div>
            <Terminal />
            {stats && <Stats />}
            <HUD />
        </div>
    )
}
export default LingoEditor
