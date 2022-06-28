import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import { useState } from "preact/hooks"

preventTreeShake(h)

const HUD = () => {
    const [color, setColor] = useState("white")

    return (
        <div style={{ width: 0, zIndex: 1, position: "relative" }}>
            <div style={{ color: color }}>
                hello world
            </div>
        </div>
    )
}

register(HUD, "lingo3d-hud")