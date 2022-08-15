import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"
import { useState } from "preact/hooks"

preventTreeShake(h)

type IconHolderProps = {
    name: string
    children: JSX.Element
}

function IconHolder({ children, name }: IconHolderProps) {
    const [hover, setHover] = useState(false)

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 12.5px 10px 12.5px",
                cursor: "pointer",
                width: "75px",
                background: hover
                    ? "linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2))"
                    : "rgb(40, 41, 46)"
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div>{children}</div>
            <h6 style={{ margin: 0, overflow: "hidden" }}>{name}</h6>
        </div>
    )
}

export default IconHolder
