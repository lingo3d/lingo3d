import { useRef, useEffect } from "preact/hooks"
import settings from "../../api/settings"
import { getWorldPlay } from "../../states/useWorldPlay"
import Runtime from "./Runtime"
import useSyncState from "../hooks/useSyncState"

const World = () => {
    const elRef = useRef<HTMLDivElement>(null)
    const worldPlay = useSyncState(getWorldPlay)

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
            {(worldPlay === "runtime" || worldPlay === "testScript") && (
                <Runtime />
            )}
        </div>
    )
}

export default World
