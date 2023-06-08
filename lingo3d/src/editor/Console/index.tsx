import { useEffect, useRef } from "preact/hooks"
import unsafeGetValue from "../../utils/unsafeGetValue"
import { editorUrlPtr } from "../../pointers/assetsPathPointers"
import { Cancellable } from "@lincode/promiselikes"
import { PANELS_HEIGHT } from "../../globals"

const Console = () => {
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
            className="lingo3d-ui lingo3d-bg"
            style={{ border: "none", height: PANELS_HEIGHT }}
            src={editorUrlPtr + "console/index.html"}
        />
    )
}

export default Console
