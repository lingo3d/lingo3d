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
                opacity: 0.75
            }}
        >
            <Hotkeys hotkey="W" hotkeyFunction="MOVE FORWARD" />
            <Hotkeys hotkey="S" hotkeyFunction="MOVE BACKWARDS" />
            <Hotkeys hotkey="A" hotkeyFunction="MOVE LEFT" />
            <Hotkeys hotkey="D" hotkeyFunction="MOVE RIGHT" />
            <Hotkeys hotkey="↑" hotkeyFunction="MOVE UP" />
            <Hotkeys hotkey="↓" hotkeyFunction="MOVE DOWN" />
            <Hotkeys hotkey="C" hotkeyFunction="CENTER SELECTED" />
        </div>
    )
}

register(HUD, "lingo3d-hud")
