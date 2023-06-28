import HotKey from "./HotKey"
import mainCamera from "../../engine/mainCamera"
import { createPortal, useEffect, useState } from "preact/compat"
import useInitCSS from "../hooks/useInitCSS"
import Spinner from "../component/Spinner"
import InfoScreen from "./InfoScreen"
import useSyncState from "../hooks/useSyncState"
import { getCameraRendered } from "../../states/useCameraRendered"
import useInitEditor from "../hooks/useInitEditor"
import { overlayContainer } from "../../engine/renderLoop/containers"
import { getDocumentHidden } from "../../states/useDocumentHidden"
import { isBusy } from "../../pointers/busyCountPtr"

const HUD = () => {
    useInitCSS()
    useInitEditor()

    const cameraRendered = useSyncState(getCameraRendered)
    const documentHidden = useSyncState(getDocumentHidden)
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => setBusy(isBusy()), 100)
        return () => {
            clearInterval(interval)
        }
    }, [])

    return createPortal(
        <div
            className="lingo3d-ui lingo3d-absfull"
            style={{ pointerEvents: "none", padding: 10 }}
        >
            <InfoScreen mounted={busy}>
                <Spinner size={14} />
                loading remote data
            </InfoScreen>
            <InfoScreen
                style={{ background: "rgba(0, 0, 0, 0.5)" }}
                mounted={documentHidden}
            >
                paused
            </InfoScreen>
            {cameraRendered === mainCamera && (
                <div style={{ opacity: 0.5 }}>
                    <HotKey hotkey="⇧" description="accelerate" />
                    <HotKey hotkey="W" description="move forward" />
                    <HotKey hotkey="S" description="move backwards" />
                    <HotKey hotkey="A" description="move left" />
                    <HotKey hotkey="D" description="move right" />
                    <HotKey hotkey="↑" description="move up" />
                    <HotKey hotkey="↓" description="move down" />
                    <HotKey hotkey="C" description="center selected" />
                    <HotKey hotkey="⌫" description="delete selected" />
                    <div style={{ display: "flex", gap: 4 }}>
                        <HotKey hotkey="⌘" />
                        <HotKey hotkey="C" description="copy selected" />
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                        <HotKey hotkey="⌘" />
                        <HotKey hotkey="O" description="open project" />
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                        <HotKey hotkey="⌘" />
                        <HotKey hotkey="S" description="save scene" />
                    </div>
                    <HotKey hotkey="G" description="toggle grid" />
                </div>
            )}
        </div>,
        overlayContainer
    )
}
export default HUD
