import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import HotKey from "./HotKey"
import { useCameraRendered, useEditorMounted } from "../states"
import mainCamera from "../../engine/mainCamera"
import { createPortal } from "preact/compat"
import { container } from "../../engine/renderLoop/renderSetup"

preventTreeShake(h)

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
                    <HotKey hotkey="W" hotkeyFunction="move forward" />
                    <HotKey hotkey="S" hotkeyFunction="move backwards" />
                    <HotKey hotkey="A" hotkeyFunction="move left" />
                    <HotKey hotkey="D" hotkeyFunction="move right" />
                    <HotKey hotkey="↑" hotkeyFunction="move up" />
                    <HotKey hotkey="↓" hotkeyFunction="move down" />
                    <HotKey hotkey="C" hotkeyFunction="center selected" />
                    <HotKey hotkey="SHIFT" hotkeyFunction="Accelerate" />
                </div>
            )}
        </div>,
        container
    )
}
export default HUD

register(HUD, "lingo3d-hud")
