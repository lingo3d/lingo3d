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

type Props = {
    embedded?: boolean
}

const LingoEditor = ({ embedded }: Props) => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el || embedded) return
        settings.autoMount = el
    }, [embedded])

    const [fileBrowser] = useFileBrowser()
    const [stats] = useStats()

    return (
        <div
            className="lingo3d-ui"
            style={
                embedded
                    ? { display: "flex", flexWrap: "nowrap", height: "100vh" }
                    : {
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          left: 0,
                          top: 0,
                          display: "flex",
                          flexWrap: "nowrap"
                      }
            }
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
                    <Library />
                </div>
                {fileBrowser && <FileBrowser />}
            </div>
            <HUD />
            {stats && <Stats />}
            <div
                ref={elRef}
                style={{ height: "100%", flexGrow: 1, position: "relative" }}
            />
        </div>
    )
}
export default LingoEditor

register(LingoEditor, "lingo3d-lingoeditor")
