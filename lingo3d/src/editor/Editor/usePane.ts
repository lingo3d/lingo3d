import { RefObject } from "preact/compat"
import { useLayoutEffect, useState } from "preact/hooks"
import { Pane } from "./tweakpane"

export default (containerRef: RefObject<HTMLDivElement>) => {
    const [pane, setPane] = useState<Pane>()

    useLayoutEffect(() => {
        const el = containerRef.current
        if (!el) return
        
        const pane = new Pane({ container: el })
        setPane(pane)

        return () => {
            pane.dispose()
            setPane(undefined)
        }
    }, [])

    return pane
}
