import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import Hotkeys from './ShortKeys'

preventTreeShake(h)

const HUD = () => {

    return (
        <div style={{ width: 0, zIndex: 1, position: "relative", left: '5px', color: 'white' }}>
            <Hotkeys hotkey='W' hotkeyFunction="MOVE FORWARD" />
            <Hotkeys hotkey='S' hotkeyFunction="MOVE BACKWARDS" />
            <Hotkeys hotkey='A' hotkeyFunction="MOVE LEFT" />
            <Hotkeys hotkey='D' hotkeyFunction="MOVE RIGHT" />
            <Hotkeys hotkey='↑' hotkeyFunction="MOVE UP" />
            <Hotkeys hotkey='↓' hotkeyFunction="MOVE DOWN" />
            <Hotkeys hotkey='C' hotkeyFunction="CENTER SELECTED" />
        </div>
    )
}

register(HUD, "lingo3d-hud")