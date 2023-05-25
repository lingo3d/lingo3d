import { useLayoutEffect, useState } from "preact/hooks"
import { Pane } from "./tweakpane"

export default () => {
    const [pane, setPane] = useState<Pane>()
    const [container, setContainer] = useState<any>()

    useLayoutEffect(() => {
        if (!container) return

        container.classList.add("lingo3d-font")

        const pane = new Pane({ container })
        setPane(pane)

        return () => {
            pane.dispose()
            setPane(undefined)
        }
    }, [container])

    return <const>[pane, setContainer]
}
