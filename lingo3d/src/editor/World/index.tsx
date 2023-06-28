import { useRef, useEffect } from "preact/hooks"
import settings from "../../api/settings"
import { getWorldPlay } from "../../states/useWorldPlay"
import Runtime from "./Runtime"
import useSyncState from "../hooks/useSyncState"
import { getStats } from "../../states/useStats"
import HUD from "./HUD"
import Stats from "./Stats"
import { getUILayer } from "../../states/useUILayer"

const World = () => {
    const elRef = useRef<HTMLDivElement>(null)
    const worldPlay = useSyncState(getWorldPlay)
    const stats = useSyncState(getStats)
    const uiLayer = useSyncState(getUILayer)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        settings.autoMount = el
        return () => {
            settings.autoMount = false
        }
    }, [])

    return (
        <div ref={elRef} style={{ flexGrow: 1 }}>
            {(worldPlay === "runtime" || worldPlay === "script") && <Runtime />}
            {uiLayer && <HUD />}
            {stats && <Stats />}
        </div>
    )
}

export default World
