import CloseableTab from "../component/tabs/CloseableTab"
import AppBar from "../component/bars/AppBar"
import useInitCSS from "../utils/useInitCSS"
import FileBrowser from "../FileBrowser"
import { useEffect } from "preact/hooks"
import TimelineEditor from "../TimelineEditor"
import RulerBar from "../TimelineEditor/RulerBar"
import { PANELS_HEIGHT } from "../../globals"
import { useFileBrowser } from "../states/useFileBrowser"
import { setTimeline, useTimeline } from "../states/useTimeline"
import { useSignal } from "@preact/signals"

const Panels = () => {
    useInitCSS(true)

    const [fileBrowser, setFileBrowser] = useFileBrowser()
    const [timeline] = useTimeline()
    const selectedSignal = useSignal<string | undefined>(undefined)

    useEffect(() => {
        if (fileBrowser) selectedSignal.value = "files"
    }, [fileBrowser])

    useEffect(() => {
        if (timeline) selectedSignal.value = "timeline"
    }, [timeline])

    if (!fileBrowser && !timeline) return null

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
                <AppBar selectedSignal={selectedSignal} style={{ width: 200 }}>
                    <CloseableTab
                        disabled={!timeline}
                        onClose={() => setTimeline(undefined)}
                    >
                        timeline
                    </CloseableTab>
                    <CloseableTab
                        disabled={!fileBrowser}
                        onClose={() => setFileBrowser(false)}
                    >
                        files
                    </CloseableTab>
                </AppBar>
                <AppBar style={{ flexGrow: 1 }}>
                    {selectedSignal.value === "timeline" && <RulerBar />}
                </AppBar>
            </div>
            <div style={{ flexGrow: 1 }}>
                {selectedSignal.value === "files" && fileBrowser && (
                    <FileBrowser />
                )}
                {selectedSignal.value === "timeline" && timeline && (
                    <TimelineEditor />
                )}
            </div>
        </div>
    )
}
export default Panels
