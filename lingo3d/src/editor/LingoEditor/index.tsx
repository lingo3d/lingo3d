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
import Retargeter from "../Retargeter"
import GameGraphEditor from "../GameGraphEditor"
import { getGameGraph } from "../../states/useGameGraph"

const LingoEditor = () => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (el) settings.autoMount = el
    }, [])

    const stats = useSyncState(getStats)
    const gameGraph = useSyncState(getGameGraph)

    const retargeter = false

    return (
        <div
            className="lingo3d-ui lingo3d-lingoeditor lingo3d-absfull"
            onContextMenu={DEBUG ? undefined : (e) => e.preventDefault()}
        >
            <Toolbar />
            <SceneGraph />
            {retargeter ? (
                <Retargeter />
            ) : gameGraph ? (
                <GameGraphEditor />
            ) : (
                <Editor />
            )}
            {!gameGraph && <Library />}
            {!gameGraph && <Panels />}

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
