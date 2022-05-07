import { getRenderer } from "lingo3d/lib/states/useRenderer"
import { useLayoutEffect, useRef } from "react"
import { WebGLRenderer } from "three"

export default () => {
    const renderer = useRef<WebGLRenderer>()

    useLayoutEffect(() => {
        const handle = getRenderer(value => {
            renderer.current = value
        })
        return () => {
            handle.cancel()
        }
    }, [])

    return renderer
}