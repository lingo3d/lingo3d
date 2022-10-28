import register from "preact-custom-element"
import Toolbar from "../Toolbar"
import SceneGraph from "../SceneGraph"
import Editor from "../Editor"
import Library from "../Library"
import HUD from "../HUD"
import { useEffect, useRef } from "preact/hooks"
import settings from "../../api/settings"
import FileBrowser from "../FileBrowser"
import { useFileBrowser, useStats } from "../states"
import Stats from "../Stats"

const LingoEditor = () => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (el) settings.autoMount = el
    }, [])

    const [fileBrowser] = useFileBrowser()
    const [stats] = useStats()

    return (
        <div
            className="lingo3d-ui lingo3d-lingoeditor"
            style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0
            }}
        >
            <Toolbar />
            <SceneGraph />
            <Editor />
            <Library />
            {fileBrowser && <FileBrowser />}
            <HUD />
            {stats && <Stats />}
            <div
                className="lingo3d-world"
                ref={elRef}
                style={{ height: "100%", flexGrow: 1, position: "relative" }}
            />
        </div>
    )
}
export default LingoEditor

register(LingoEditor, "lingo3d-lingoeditor")
