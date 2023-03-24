import CloseableTab from "../component/tabs/CloseableTab"
import AppBar from "../component/bars/AppBar"
import useInitCSS from "../hooks/useInitCSS"
import FileBrowser from "../FileBrowser"
import { useEffect } from "preact/hooks"
import TimelineEditor from "../TimelineEditor"
import { PANELS_HEIGHT } from "../../globals"
import { getTimeline, setTimeline } from "../../states/useTimeline"
import { useSignal } from "@preact/signals"
import TimelineControls from "../TimelineEditor/TimelineControls"
import useSyncState from "../hooks/useSyncState"
import { getFileBrowser, setFileBrowser } from "../../states/useFileBrowser"
import useInitEditor from "../hooks/useInitEditor"

const Panels = () => {
    useInitCSS()
    useInitEditor()

    const fileBrowser = useSyncState(getFileBrowser)
    const timeline = useSyncState(getTimeline)
    const selectedSignal = useSignal<string | undefined>(undefined)

    useEffect(() => {
        if (fileBrowser) selectedSignal.value = "files"
    }, [fileBrowser])

    useEffect(() => {
        if (timeline) selectedSignal.value = "timeline"
    }, [timeline])

    // if (!fileBrowser && !timeline) return null

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-panels lingo3d-flexcol"
            style={{ height: PANELS_HEIGHT, width: "100%" }}
        >
            <div style={{ display: "flex" }}>
                <AppBar style={{ width: 200 }}>
                    <CloseableTab
                        selectedSignal={selectedSignal}
                        disabled={!timeline}
                        onClose={() => setTimeline(undefined)}
                    >
                        timeline
                    </CloseableTab>
                    <CloseableTab
                        selectedSignal={selectedSignal}
                        disabled={!fileBrowser}
                        onClose={() => setFileBrowser(false)}
                    >
                        files
                    </CloseableTab>
                </AppBar>
                <div style={{ flexGrow: 1 }}>
                    {selectedSignal.value !== "files" && <TimelineControls />}
                </div>
            </div>
            <div style={{ flexGrow: 1 }}>
                {selectedSignal.value === "files" ? (
                    <FileBrowser />
                ) : (
                    <TimelineEditor />
                )}
            </div>
        </div>
    )
}
export default Panels
