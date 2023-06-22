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
import { useEffect } from "preact/hooks"
import MenuBar from "../MenuBar"
import { getScript } from "../../states/useScript"
import ScriptEditor from "../ScriptEditor"
import NewScriptDialog from "../ScriptEditor/NewScriptDialog"
import { getWorldPlay } from "../../states/useWorldPlay"
import Console from "../Console"

const LingoEditor = () => {
    const stats = useSyncState(getStats)
    const gameGraph = useSyncState(getGameGraph)
    const script = useSyncState(getScript)
    const dummyIK = useSyncState(getDummyIK)
    const worldExpanded = useSyncState(getWorldExpanded)
    const worldPlay = useSyncState(getWorldPlay)

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
                    {!script && <SceneGraph />}
                    {dummyIK ? (
                        <DummyIKEditor />
                    ) : gameGraph ? (
                        <GameGraphEditor />
                    ) : script ? (
                        <ScriptEditor />
                    ) : (
                        <Editor />
                    )}
                    {!gameGraph && !script && !dummyIK && <Library />}
                    {!gameGraph && !script && !dummyIK && <Panels />}
                </>
            )}
            <WorldBar />
            <div
                className="lingo3d-world lingo3d-bg lingo3d-flexcol"
                style={{ flexGrow: 1 }}
            >
                {worldPlay === "runtime" || worldPlay === "script" ? (
                    <Runtime />
                ) : (
                    <World />
                )}
                <Console />
            </div>
            {stats && <Stats />}
            <HUD />
            <NewScriptDialog />
        </div>
    )
}
export default LingoEditor
