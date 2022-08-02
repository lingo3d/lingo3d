import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import Hotkeys from "./HotKeys"
import { useCameraRendered, useEditorMounted } from "../states"
import mainCamera from "../../engine/mainCamera"

preventTreeShake(h)

const HUD = () => {
    const [editorMounted] = useEditorMounted()
    const [cameraRendered] = useCameraRendered()
    //todo
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
            <Hotkeys hotkey="W" hotkeyFunction="move forward" />
            <Hotkeys hotkey="S" hotkeyFunction="move backwards" />
            <Hotkeys hotkey="A" hotkeyFunction="move left" />
            <Hotkeys hotkey="D" hotkeyFunction="move right" />
            <Hotkeys hotkey="↑" hotkeyFunction="move up" />
            <Hotkeys hotkey="↓" hotkeyFunction="move down" />
            <Hotkeys hotkey="C" hotkeyFunction="center selected" />
        </div>
    )
}
export default HUD

register(HUD, "lingo3d-hud")
