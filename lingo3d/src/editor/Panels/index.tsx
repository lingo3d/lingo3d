import CloseableTab from "../component/tabs/CloseableTab"
import AppBar from "../component/bars/AppBar"
import useInitCSS from "../hooks/useInitCSS"
import FileBrowser from "../FileBrowser"
import { useEffect, useState } from "preact/hooks"
import TimelineEditor from "../TimelineEditor"
import { PANELS_HEIGHT } from "../../globals"
import { getTimeline } from "../../states/useTimeline"
import { useSignal } from "@preact/signals"
import TimelineControls from "../TimelineEditor/TimelineControls"
import useSyncState from "../hooks/useSyncState"
import useInitEditor from "../hooks/useInitEditor"
import FileBrowserControls from "../FileBrowser/FileBrowserControls"
import { selectTab } from "../component/tabs/Tab"
import { onOpenFolder } from "../../events/onOpenFolder"
import { sceneGraphWidthSignal } from "../signals/sizeSignals"

const Panels = () => {
    useInitCSS()
    useInitEditor()

    const [files, setFiles] = useState(false)
    const timeline = useSyncState(getTimeline)
    const selectedSignal = useSignal<Array<string>>([])

    useEffect(() => {
        const handle = onOpenFolder(() => setFiles(true))
        return () => {
            handle.cancel()
        }
    }, [])

    useEffect(() => {
        files && selectTab(selectedSignal, "files")
    }, [files])

    useEffect(() => {
        timeline && selectTab(selectedSignal, "timeline")
    }, [timeline])

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-panels lingo3d-flexcol"
            style={{ height: PANELS_HEIGHT, width: "100%" }}
        >
            <div style={{ display: "flex" }}>
                <AppBar style={{ width: sceneGraphWidthSignal.value }}>
                    <CloseableTab selectedSignal={selectedSignal}>
                        timeline
                    </CloseableTab>
                    <CloseableTab
                        selectedSignal={selectedSignal}
                        disabled={!files}
                    >
                        files
                    </CloseableTab>
                </AppBar>
                <div style={{ flexGrow: 1 }}>
                    {selectedSignal.value.at(-1) === "files" ? (
                        <FileBrowserControls />
                    ) : (
                        <TimelineControls />
                    )}
                </div>
            </div>
            <div style={{ flexGrow: 1 }}>
                {selectedSignal.value.at(-1) === "files" ? (
                    <FileBrowser />
                ) : (
                    <TimelineEditor />
                )}
            </div>
        </div>
    )
}
export default Panels
