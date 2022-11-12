import register from "preact-custom-element"
import CloseableTab from "../component/tabs/CloseableTab"
import AppBar from "../component/bars/AppBar"
import useInitCSS from "../utils/useInitCSS"
import { useFileBrowser } from "../states"
import FileBrowser from "../FileBrowser"
import { setFileBrowser } from "../../states/useFileBrowser"
import { useState } from "preact/hooks"
import Timeline from "../Timeline"
import TitleBarButton from "../component/bars/TitleBarButton"
import DeleteIcon from "../SceneGraph/icons/DeleteIcon"
import FindIcon from "../SceneGraph/icons/FindIcon"
import GroupIcon from "../SceneGraph/icons/GroupIcon"
import TimelineBar from "../Timeline/TimelineBar"

const Panels = () => {
    useInitCSS(true)

    const [fileBrowser] = useFileBrowser()
    const [tab, setTab] = useState<string | undefined>(undefined)

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-panels"
            style={{
                height: 200,
                width: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <div style={{ display: "flex" }}>
                <AppBar onSelectTab={setTab} style={{ width: 200 }}>
                    <CloseableTab>animation</CloseableTab>
                    <CloseableTab
                        disabled={!fileBrowser}
                        onClose={() => setFileBrowser(false)}
                        selected={!!fileBrowser}
                    >
                        files
                    </CloseableTab>
                </AppBar>
                <AppBar style={{ flexGrow: 1 }}>
                    {tab === "animation" && <TimelineBar />}
                </AppBar>
            </div>
            <div style={{ flexGrow: 1 }}>
                {tab === "files" && fileBrowser && <FileBrowser />}
                {tab === "animation" && <Timeline />}
            </div>
        </div>
    )
}
export default Panels

register(Panels, "lingo3d-panels")
