import { preload } from "lingo3d"
import { useLayoutEffect, useState } from "react"

export default (urls: Array<string>, total: string | number) => {
    const [progress, setProgress] = useState(0)

    useLayoutEffect(() => {
        let proceed = true

        preload(urls, total, val => proceed && setProgress(val)).then(() => proceed && setProgress(100))

        return () => {
            proceed = false
        }
    }, [])
    return progress
}