import { useEffect, useRef } from "preact/hooks"
import unsafeGetValue from "../../utils/unsafeGetValue"
import { editorUrlPtr } from "../../pointers/assetsPathPointers"
import { Cancellable } from "@lincode/promiselikes"
import { VERSION } from "../../globals"
import { CSSProperties } from "preact/compat"

type Props = {
    style?: CSSProperties
}

const OutputConsole = ({ style }: Props) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const handle = new Cancellable()
        const interval = setInterval(() => {
            const $hook = unsafeGetValue(iframe, "$hook")
            const $unhook = unsafeGetValue(iframe, "$unhook")
            if (!$hook || !$unhook) return

            const hookedConsole = $hook(console, window)
            console.log(`lingo3d version ${VERSION}`)
            console.log("console initialized")

            clearInterval(interval)
            handle.then(() => $unhook(hookedConsole, window))

            throw new Error("success??")
        }, 100)

        return () => {
            clearInterval(interval)
            handle.cancel()
        }
    }, [])

    return (
        <iframe
            ref={iframeRef}
            style={{ border: "none", flexGrow: 1, ...style }}
            src={editorUrlPtr + "console/index.html"}
        />
    )
}

export default OutputConsole
