import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake(h)

const Menu = () => {
    return (
        <div
            className="lingo3d-ui"
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: 20,
                background: "rgb(35, 36, 41)",
                marginTop: -20,
                zIndex: 10
            }}
        >
            hello world
        </div>
    )
}

register(Menu, "lingo3d-menu")
