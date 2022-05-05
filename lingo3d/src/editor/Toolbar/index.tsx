import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake(h)

const Toolbar = () => {
    return (
        <div
         className="lingo3d-ui"
         style={{
             width: 50,
             height: "100%",
             background: "rgb(40, 41, 46)",
             padding: 10
         }}
        >

        </div>
    )
}

register(Toolbar, "lingo3d-toolbar")