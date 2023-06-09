import { useEffect, useRef } from "preact/hooks"
import { Cancellable } from "@lincode/promiselikes"
import { loadTerminal } from "./loadTerminal"

const Terminal = () => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        const handle = new Cancellable()
        loadTerminal(el, handle)

        return () => {
            handle.cancel()
        }
    }, [])

    return (
        <div style={{ flexGrow: 1 }}>
            <div
                ref={elRef}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "calc(100% - 10px)",
                    paddingLeft: "10px",
                    paddingTop: "10px"
                }}
            />
        </div>
    )
}

export default Terminal
