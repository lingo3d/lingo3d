import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"
import { useState } from "preact/hooks"
import { JSXInternal } from "preact/src/jsx"
import { SVGAttributes } from "react"

preventTreeShake(h)

function IconHolder({ children }: SVGAElement) {
    const [hover, setHover] = useState(false)

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 12.5px 10px 12.5px",
                cursor: "pointer",
                background: hover
                    ? "linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2))"
                    : "rgb(40, 41, 46)"
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {children}
        </div>
    )
}

export default IconHolder
