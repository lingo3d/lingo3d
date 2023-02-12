import { useLayoutEffect, useState } from "preact/hooks"
import { Pane } from "./tweakpane"

export default () => {
    const [pane, setPane] = useState<Pane>()
    const [container, setContainer] = useState<any>()

    useLayoutEffect(() => {
        if (!container) return

        const pane = new Pane({ container })
        setPane(pane)

        return () => {
            pane.dispose()
            setPane(undefined)
        }
    }, [container])

    return <const>[pane, setContainer, container]
}
