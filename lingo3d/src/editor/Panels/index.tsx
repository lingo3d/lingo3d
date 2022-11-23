import CloseableTab from "../component/tabs/CloseableTab"
import AppBar from "../component/bars/AppBar"
import useInitCSS from "../utils/useInitCSS"
import FileBrowser from "../FileBrowser"
import { useState } from "preact/hooks"
import TimelineEditor from "../TimelineEditor"
import RulerBar from "../TimelineEditor/RulerBar"
import { PANELS_HEIGHT } from "../../globals"
import { useFileBrowser } from "../states/useFileBrowser"

const Panels = () => {
    useInitCSS(true)

    const [fileBrowser, setFileBrowser] = useFileBrowser()
    const [tab, setTab] = useState<string>()

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-panels"
            style={{
                height: PANELS_HEIGHT,
                width: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <div style={{ display: "flex" }}>
                <AppBar onSelectTab={setTab} style={{ width: 200 }}>
                    <CloseableTab>timeline</CloseableTab>
                    <CloseableTab
                        disabled={!fileBrowser}
                        onClose={() => setFileBrowser(false)}
                        selected={!!fileBrowser}
                    >
                        files
                    </CloseableTab>
                </AppBar>
                <AppBar style={{ flexGrow: 1 }}>
                    {tab === "timeline" && <RulerBar />}
                </AppBar>
            </div>
            <div style={{ flexGrow: 1 }}>
                {tab === "files" && fileBrowser && <FileBrowser />}
                {tab === "timeline" && <TimelineEditor />}
            </div>
        </div>
    )
}
export default Panels
