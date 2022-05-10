import { getRenderer } from "lingo3d/lib/states/useRenderer"
import { useLayoutEffect, useState } from "react"

export default () => {
    const [renderer, setRenderer] = useState(() => getRenderer())

    useLayoutEffect(() => {
        const handle = getRenderer(value => {
            setRenderer(value)
        })
        return () => {
            handle.cancel()
        }
    }, [])

    return renderer
}