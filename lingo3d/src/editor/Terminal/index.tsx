import { useEffect, useRef } from "preact/hooks"
import { Cancellable } from "@lincode/promiselikes"

const Terminal = () => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        const handle = new Cancellable()
        import("./loadTerminal").then(({ loadTerminal }) =>
            loadTerminal(el, handle)
        )
        return () => {
            handle.cancel()
        }
    }, [])

    return (
        <div className="lingo3d-ui lingo3d-bg lingo3d-terminal">
            <div ref={elRef} className="lingo3d-xterm" />
        </div>
    )
}

export default Terminal
