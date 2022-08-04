import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import HotKey from "./HotKey"
import { useCameraRendered, useEditorMounted } from "../states"
import mainCamera from "../../engine/mainCamera"

preventTreeShake(h)

const HUD = () => {
    const [editorMounted] = useEditorMounted()
    const [cameraRendered] = useCameraRendered()
    const editorActive = editorMounted && cameraRendered === mainCamera

    if (!editorActive) return null

    return (
        <div
            className="lingo3d-ui"
            style={{
                width: 0,
                zIndex: 1,
                position: "relative",
                left: 15,
                top: 10,
                overflow: "visible",
                opacity: 0.5,
                pointerEvents: "none"
            }}
        >
            <HotKey hotkey="W" hotkeyFunction="move forward" />
            <HotKey hotkey="S" hotkeyFunction="move backwards" />
            <HotKey hotkey="A" hotkeyFunction="move left" />
            <HotKey hotkey="D" hotkeyFunction="move right" />
            <HotKey hotkey="↑" hotkeyFunction="move up" />
            <HotKey hotkey="↓" hotkeyFunction="move down" />
            <HotKey hotkey="C" hotkeyFunction="center selected" />
            <HotKey hotkey="SHIFT" hotkeyFunction="Accelerate" />
        </div>
    )
}
export default HUD

register(HUD, "lingo3d-hud")
