import { useRef, useEffect } from "preact/hooks"
import settings from "../../api/settings"
import { getWorldMode } from "../../states/useWorldMode"
import Runtime from "./Runtime"
import useSyncState from "../hooks/useSyncState"

const World = () => {
    const elRef = useRef<HTMLDivElement>(null)
    const worldPlay = useSyncState(getWorldMode)

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
            {worldPlay === "runtime" && <Runtime />}
        </div>
    )
}

export default World
