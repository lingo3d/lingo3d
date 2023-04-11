import Toolbar from "../Toolbar"
import SceneGraph from "../SceneGraph"
import Editor from "../Editor"
import Library from "../Library"
import HUD from "../HUD"
import { useEffect, useRef } from "preact/hooks"
import settings from "../../api/settings"
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

const LingoEditor = () => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (el) settings.autoMount = el
    }, [])

    const stats = useSyncState(getStats)
    const gameGraph = useSyncState(getGameGraph)
    const dummyIK = useSyncState(getDummyIK)

    return (
        <div
            className="lingo3d-ui lingo3d-lingoeditor lingo3d-absfull"
            onContextMenu={DEBUG ? undefined : prevent}
        >
            <Toolbar />
            <SceneGraph />
            {dummyIK ? (
                <DummyIKEditor />
            ) : gameGraph ? (
                <GameGraphEditor />
            ) : (
                <Editor />
            )}
            {!gameGraph && !dummyIK && <Library />}
            {!gameGraph && !dummyIK && <Panels />}

            <WorldBar />
            <div
                className="lingo3d-world lingo3d-bg"
                ref={elRef}
                style={{ height: "100%", flexGrow: 1, position: "relative" }}
            />
            {stats && <Stats />}
            <HUD />
        </div>
    )
}
export default LingoEditor
