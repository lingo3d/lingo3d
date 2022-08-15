import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"
import { useState, useRef } from "preact/hooks"

preventTreeShake(h)

type IconHolderProps = {
    name: string
    children: JSX.Element
}

function IconHolder({ children, name }: IconHolderProps) {
    const [hover, setHover] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)

    const elRef = useRef<HTMLSpanElement>(null)

    function checkEllipsis() {
        setShowTooltip(elRef.current.scrollWidth > elRef.current.clientWidth)
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: "5px 6px 5px 6px",
                cursor: "pointer",
                width: "70px",
                height: "50px",
                position: "relative",
                background: hover
                    ? "linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2))"
                    : "rgb(40, 41, 46)"
            }}
            onMouseEnter={() => {
                setHover(true)
                checkEllipsis()
            }}
            onMouseLeave={() => {
                setHover(false)
                setShowTooltip(false)
            }}
        >
            <span
                style={{
                    position: "absolute",
                    top: "20%",
                    left: "40%",
                    display: showTooltip ? "block" : "none",
                    zIndex: 999,
                    background: "rgb(231,233,235)",
                    padding: "2px",
                    fontWeight: "bold",
                    color: "black",
                    fontSize: "9px",
                    borderRadius: "2px"
                }}
            >
                {name}
            </span>
            <div>{children}</div>
            <h6
                ref={elRef}
                style={{
                    margin: 0,
                    width: "100%",
                    height: "20px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "center"
                }}
            >
                {name}
            </h6>
        </div>
    )
}

export default IconHolder
