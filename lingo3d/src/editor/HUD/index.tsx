import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import Hotkeys from "./HotKeys"
import { useEditorActive } from "../states"

preventTreeShake(h)

const HUD = () => {
    const [editorActive] = useEditorActive()

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

register(HUD, "lingo3d-hud")
