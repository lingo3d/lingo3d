import register from "preact-custom-element"
import HotKey from "./HotKey"
import { useCameraRendered, useEditorMounted } from "../states"
import mainCamera from "../../engine/mainCamera"
import { createPortal } from "preact/compat"
import { container } from "../../engine/renderLoop/renderSetup"

const HUD = () => {
    const [editorMounted] = useEditorMounted()
    const [cameraRendered] = useCameraRendered()

    return createPortal(
        <div
            className="lingo3d-ui"
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                padding: 10
            }}
        >
            {!!editorMounted && cameraRendered === mainCamera && (
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
                </div>
            )}
        </div>,
        container
    )
}
export default HUD

register(HUD, "lingo3d-hud")
