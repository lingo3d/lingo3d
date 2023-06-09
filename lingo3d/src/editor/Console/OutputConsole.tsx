import { useEffect, useRef } from "preact/hooks"
import unsafeGetValue from "../../utils/unsafeGetValue"
import { editorUrlPtr } from "../../pointers/assetsPathPointers"
import { Cancellable } from "@lincode/promiselikes"
import { VERSION } from "../../globals"

const OutputConsole = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const handle = new Cancellable()
        const interval = setInterval(() => {
            const $hook = unsafeGetValue(iframe, "$hook")
            const $unhook = unsafeGetValue(iframe, "$unhook")
            if (!$hook || !$unhook) return

            const hookedConsole = $hook(console)
            console.log(`lingo3d version ${VERSION}`)
            console.log("console initialized")

            clearInterval(interval)
            handle.then(() => $unhook(hookedConsole))
        }, 100)

        return () => {
            clearInterval(interval)
            handle.cancel()
        }
    }, [])

    return (
        <iframe
            ref={iframeRef}
            style={{ border: "none", flexGrow: 1 }}
            src={editorUrlPtr + "console/index.html"}
        />
    )
}

export default OutputConsole
