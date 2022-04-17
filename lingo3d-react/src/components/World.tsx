import React, { useLayoutEffect, useRef } from "react"
import { container, outline, settings } from "lingo3d"
import index from "lingo3d"
import { preventTreeShake } from "@lincode/utils"
import Setup from "./logical/Setup"
import { useMemoOnce } from "@lincode/hooks"
import scene from "lingo3d/lib/engine/scene"
import ISetup from "lingo3d/lib/interface/ISetup"

preventTreeShake(index)
outline.style.border = "none"
outline.style.pointerEvents = "none"
outline.style.userSelect = "none"
outline.style.overflow = "hidden"
settings.autoMout = false

type WorldProps = ISetup & {
    style?: React.CSSProperties
    className?: string
    position?: "absolute" | "relative" | "fixed"
    children?: React.ReactNode
}

const World: React.FC<WorldProps> = ({ style, className, position, children, ...rest }) => {
    const divRef = useRef<HTMLDivElement>(null)

    rest.wasmPath && (settings.wasmPath = rest.wasmPath)

    useMemoOnce(() => {
        for (const child of [...scene.children])
            child.userData.manager && scene.remove(child)
    })

    useLayoutEffect(() => {
        const el = divRef.current
        if (!el) return

        el.appendChild(container)

        const resizeObserver = new ResizeObserver(() => {
            settings.resolution = settings.viewportSize = [el.clientWidth, el.clientHeight]
        })
        resizeObserver.observe(el)

        return () => {
            resizeObserver.disconnect()
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