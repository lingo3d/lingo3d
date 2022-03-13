import React, { useLayoutEffect, useRef } from "react"
import { container, outline, settings } from "lingo3d"
import index from "lingo3d"
import { preventTreeShake } from "@lincode/utils"
import { SetupNode } from "lingo3d/lib/display/utils/deserialize/types"
import Setup from "./logical/Setup"

preventTreeShake(index)
outline.style.display = "none"

type WorldProps = Partial<SetupNode> & {
    style?: React.CSSProperties
    className?: string
    position?: "absolute" | "relative" | "fixed"
}

const World: React.FC<WorldProps> = ({ style, className, position, children, ...rest }) => {
    const divRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const el = divRef.current
        if (!el) return

        el.appendChild(container)

        const cb = () => {
            settings.containerWidth = settings.width = el.clientWidth
            settings.containerHeight = settings.height = el.clientHeight
        }
        cb()
        window.addEventListener("resize", cb)

        return () => {
            window.removeEventListener("resize", cb)
        }
    }, [])

    return (<>
        <Setup {...rest} />
        <div ref={divRef} style={{
            width: "100%", height: "100%", position: position ?? "absolute", top: 0, left: 0, ...style
        }}>
            {children}
        </div>
    </>)
}

export default World