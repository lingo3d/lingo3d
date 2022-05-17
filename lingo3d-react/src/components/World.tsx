import React, { useLayoutEffect, useRef } from "react"
import { rootContainer, settings } from "lingo3d"
import index from "lingo3d"
import { preventTreeShake } from "@lincode/utils"
import Setup from "./logical/Setup"
import { useMemoOnce } from "@lincode/hooks"
import scene from "lingo3d/lib/engine/scene"
import ISetup from "lingo3d/lib/interface/ISetup"
import { setResolution } from "lingo3d/lib/states/useResolution"
import { setViewportSize } from "lingo3d/lib/states/useViewportSize"

preventTreeShake(index)

export const htmlContainer = document.createElement("div")
Object.assign(htmlContainer.style, {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    userSelect: "none"
})

type WorldProps = Partial<ISetup> & {
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

        el.appendChild(rootContainer)
        el.appendChild(htmlContainer)

        const resizeObserver = new ResizeObserver(() => {
            const res: [number, number] = [el.clientWidth, el.clientHeight]
            setResolution(res)
            setViewportSize(res)
        })
        resizeObserver.observe(el)

        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    return (<>
        <Setup {...rest} />
        <div style={{
            width: "100%", height: "100%", position: position ?? "absolute", top: 0, left: 0, display: "flex", ...style
        }}>
            <div style={{ height: "100%" }}>{children}</div>
            <div ref={divRef} style={{ height: "100%", flexGrow: 1, position: "relative", zIndex: 0 }} />
        </div>
    </>)
}

export default World