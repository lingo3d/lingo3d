import register from "preact-custom-element"
import Toolbar from "../Toolbar"
import SceneGraph from "../SceneGraph"
import Editor from "../Editor"
import NodeEditor from "../NodeEditor"
import Library from "../Library"
import HUD from "../HUD"
import { useEffect, useRef } from "preact/hooks"
import settings from "../../api/settings"
import FileBrowser from "../FileBrowser"
import { useFileBrowser } from "../states"

const LingoEditor = () => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el) return
        settings.autoMount = el
    }, [])

    const [fileBrowser] = useFileBrowser()

    return (
        <div
            className="lingo3d-ui"
            style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                display: "flex"
            }}
        >
            <Toolbar />
            <div>
                <div
                    style={{
                        height: fileBrowser ? "calc(100% - 200px)" : "100%"
                    }}
                >
                    <SceneGraph />
                    <Editor />
                    <NodeEditor />
                    <Library />
                </div>
                {fileBrowser && <FileBrowser />}
            </div>
            <HUD />
            <div
                ref={elRef}
                style={{ height: "100%", flexGrow: 1, position: "relative" }}
            />
        </div>
    )
}
export default LingoEditor

register(LingoEditor, "lingo3d-lingoeditor")
