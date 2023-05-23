import { useRef, useEffect } from "preact/hooks"
import { settings } from "../../runtime"

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

    return <div ref={elRef} className="lingo3d-absfull" />
}

export default World
