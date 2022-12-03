import { createPortal, useLayoutEffect, useRef } from "preact/compat"
import { uiContainer } from "../../engine/renderLoop/renderSetup"
import { onAfterRender } from "../../events/onAfterRender"
import { onBeforeRender } from "../../events/onBeforeRender"
import StatsJS from "stats.js"

type StatsProps = {
    mode?: "fps" | "time" | "memory"
}
const Stats = ({ mode = "fps" }: StatsProps) => {
    const divRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const div = divRef.current
        if (!div) return

        const stats = new StatsJS()
        stats.showPanel(mode === "fps" ? 0 : mode === "time" ? 1 : 2)
        div.appendChild(stats.dom)
        Object.assign(stats.dom.style, {
            position: "absolute",
            right: "0px",
            left: "auto"
        })
        const beforeHandle = onBeforeRender(() => stats.begin())
        const afterHandle = onAfterRender(() => stats.end())

        return () => {
            beforeHandle.cancel()
            afterHandle.cancel()
        }
    }, [])

    return createPortal(<div ref={divRef} />, uiContainer)
}
export default Stats
