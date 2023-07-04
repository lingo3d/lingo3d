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
import CharacterRigEditor from "../CharacterRigEditor"
import { getCharacterRig } from "../../states/useCharacterRig"
import prevent from "../utils/prevent"
import { getWorldExpanded } from "../../states/useWorldExpanded"
import World from "../World"
import { useEffect } from "preact/hooks"
import MenuBar from "../MenuBar"
import { getScript } from "../../states/useScript"
import ScriptEditor from "../ScriptEditor"
import NewScriptDialog from "../ScriptEditor/NewScriptDialog"
import Console from "../Console"
import WorldToggles from "../WorldBar/WorldToggles"

const LingoEditor = () => {
    const stats = useSyncState(getStats)
    const script = useSyncState(getScript)
    const characterRig = useSyncState(getCharacterRig)
    const worldExpanded = useSyncState(getWorldExpanded)

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
                    {characterRig ? (
                        <CharacterRigEditor />
                    ) : script ? (
                        <ScriptEditor />
                    ) : (
                        <Editor />
                    )}
                    {!script && !characterRig && <Library />}
                    {!script && !characterRig && <Panels />}
                </>
            )}
            <WorldBar />
            <WorldToggles />
            <div
                className="lingo3d-world lingo3d-bg lingo3d-flexcol"
                style={{ flexGrow: 1 }}
            >
                <World />
                {!worldExpanded && <Console floating={worldExpanded} />}
            </div>
            {stats && <Stats />}
            <HUD />
            <NewScriptDialog />
        </div>
    )
}
export default LingoEditor
