import React, { useLayoutEffect, useRef } from "react"
import { settings } from "lingo3d"
import index from "lingo3d"
import { preventTreeShake } from "@lincode/utils"
import Setup from "./logical/Setup"
import ISetup from "lingo3d/lib/interface/ISetup"
import htmlContainer from "./logical/HTML/htmlContainer"

preventTreeShake(index)

type WorldProps = Partial<ISetup> & {
    style?: React.CSSProperties
    className?: string
    position?: "absolute" | "relative" | "fixed"
    children?: React.ReactNode
}

const World: React.FC<WorldProps> = ({ style, className, position, children, ...rest }) => {
    const divRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const el = divRef.current
        if (!el) return

        el.appendChild(htmlContainer)
        settings.autoMount = el

        return () => {
            settings.autoMount = false
        }
    }, [])

    return (<>
        <Setup {...rest} />
        <div style={{
            width: "100%", height: "100%", position: position ?? "absolute", top: 0, left: 0, display: "flex", ...style
        }}>
            <div style={{ height: "100%" }}>{children}</div>
            <div ref={divRef} style={{ height: "100%", flexGrow: 1, position: "relative", overflow: "hidden" }} />
        </div>
    </>)
}

export default World