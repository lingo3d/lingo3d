import React, { useLayoutEffect, useRef } from "react"
import { onBeforeRender } from "lingo3d/lib/events/onBeforeRender"
import { onAfterRender } from "lingo3d/lib/events/onAfterRender"
import StatsJS from "stats.js"

type StatsProps = {
    mode?: "fps" | "time" | "memory"
}

const Stats: React.FC<StatsProps> = ({ mode = "fps" }) => {
    const divRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const div = divRef.current
        if (!div) return

        const stats = new StatsJS()
        stats.showPanel(mode === "fps" ? 0 : mode === "time" ? 1 : 2)
        div.appendChild(stats.dom)

        const beforeHandle = onBeforeRender(() => stats.begin())
        const afterHandle = onAfterRender(() => stats.end())

        return () => {
            beforeHandle.cancel()
            afterHandle.cancel()
        }
    }, [])

    return (
        <div ref={divRef} />
    )
}

export default Stats
