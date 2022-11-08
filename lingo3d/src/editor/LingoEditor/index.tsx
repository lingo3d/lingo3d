import register from "preact-custom-element"
import Toolbar from "../Toolbar"
import SceneGraph from "../SceneGraph"
import Editor from "../Editor"
import Library from "../Library"
import HUD from "../HUD"
import { useEffect, useRef } from "preact/hooks"
import settings from "../../api/settings"
import FileBrowser from "../FileBrowser"
import { useFileBrowser, useFileCurrent, useStats } from "../states"
import Stats from "../Stats"
import Tabs from "../Tabs"
import Timeline from "../Timeline"

const LingoEditor = () => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (el) settings.autoMount = el
    }, [])

    const [fileBrowser] = useFileBrowser()
    const [fileCurrent] = useFileCurrent()
    const [stats] = useStats()

    return (
        <div className="lingo3d-ui lingo3d-lingoeditor">
            <Toolbar />
            <SceneGraph />
            <Editor />
            <Library />
            <Timeline />
            {fileBrowser && <FileBrowser />}
            {fileCurrent && <Tabs />}
            {stats && <Stats />}
            <HUD />
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
