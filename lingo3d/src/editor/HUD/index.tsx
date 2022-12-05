import HotKey from "./HotKey"
import mainCamera from "../../engine/mainCamera"
import { createPortal } from "preact/compat"
import { uiContainer } from "../../engine/renderLoop/renderSetup"
import useInitCSS from "../hooks/useInitCSS"
import Spinner from "../component/Spinner"
import InfoScreen from "./InfoScreen"
import useSyncState from "../hooks/useSyncState"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getLoadingUnpkgCount } from "../../states/useLoadingUnpkgCount"
import { getPaused } from "../../states/usePaused"

const HUD = () => {
    useInitCSS()
    const cameraRendered = useSyncState(getCameraRendered)
    const loadingUnpkgCount = useSyncState(getLoadingUnpkgCount)
    const paused = useSyncState(getPaused)

    return createPortal(
        <div
            className="lingo3d-ui lingo3d-absfull"
            style={{ pointerEvents: "none", padding: 10 }}
        >
            <InfoScreen mounted={!!loadingUnpkgCount}>
                <Spinner size={14} />
                loading data from unpkg
            </InfoScreen>
            <InfoScreen
                mounted={paused}
                style={{ background: "rgba(18, 19, 22, 0.75)" }}
                fadeIn
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
                        <HotKey hotkey="O" description="open folder" />
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                        <HotKey hotkey="⌘" />
                        <HotKey hotkey="S" description="save scene" />
                    </div>
                    <HotKey hotkey="G" description="toggle grid" />
                </div>
            )}
        </div>,
        uiContainer
    )
}
export default HUD
