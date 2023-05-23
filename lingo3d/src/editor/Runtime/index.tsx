import { useEffect, useRef } from "preact/hooks"
import {
    addRuntimeIframeScriptSystem,
    deleteRuntimeIframeScriptSystem
} from "../../systems/runtimeIframeScriptSystem"

const Runtime = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const script = `
            const dummy = new Dummy()
            dummy.onLoop = () => {
                dummy.rotationY += 1
            }
        `
        addRuntimeIframeScriptSystem(iframe, { script })

        return () => {
            deleteRuntimeIframeScriptSystem(iframe)
        }
    }, [])

    return (
        <iframe
            ref={iframeRef}
            className="lingo3d-absfull"
            style={{ border: "none" }}
            src="runtime/index.html"
        />
    )
}

export default Runtime
