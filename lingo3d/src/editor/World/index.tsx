import { useRef, useEffect } from "preact/hooks"
import settings from "../../api/settings"

const World = () => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        settings.autoMount = el
        return () => {
            settings.autoMount = false
        }
    }, [])

    return <div ref={elRef} style={{ flexGrow: 1 }} />
}

export default World
