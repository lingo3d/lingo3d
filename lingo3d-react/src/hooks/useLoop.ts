import { useCurrentRef } from "@lincode/hooks"
import { loop } from "lingo3d"
import { useLayoutEffect } from "react"

export default (cb: () => void, play = true) => {
    const cbCurrentRef = useCurrentRef(cb)

    useLayoutEffect(() => {
        if (!play) return
        
        const handle = loop(() => cbCurrentRef.current())

        return () => {
            handle.cancel()
        }
    }, [play])
}