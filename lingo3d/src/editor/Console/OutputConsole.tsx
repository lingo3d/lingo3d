import { useEffect, useRef } from "preact/hooks"
import unsafeGetValue from "../../utils/unsafeGetValue"
import { editorUrlPtr } from "../../pointers/assetsPathPointers"
import { Cancellable } from "@lincode/promiselikes"
import { VERSION } from "../../globals"
import { CSSProperties } from "preact/compat"
import logStatus from "../../utils/logStatus"

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

            // const hookedConsole = $hook(console, window)
            // logStatus(`lingo3d version ${VERSION}`)
            // logStatus("console initialized")

            // clearInterval(interval)
            // handle.then(() => $unhook(hookedConsole, window))
        }, 100)

        const handleError = (error: ErrorEvent) => console.error(error)
        window.addEventListener("error", handleError)

        return () => {
            clearInterval(interval)
            handle.cancel()
            window.removeEventListener("error", handleError)
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
