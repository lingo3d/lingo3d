import { useEffect, useRef } from "preact/hooks"
import {
    addRuntimeIframeScriptSystem,
    deleteRuntimeIframeScriptSystem
} from "../../systems/runtimeIframeScriptSystem"
import { serialize } from "../../runtime"

const Runtime = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const script = `deserialize(${JSON.stringify(serialize())})`
        addRuntimeIframeScriptSystem(iframe, { script })
        return () => {
            deleteRuntimeIframeScriptSystem(iframe)
        }
    }, [])

    return (
        <iframe
            ref={iframeRef}
            style={{ border: "none", flexGrow: 1 }}
            src="runtime/index.html"
        />
    )
}

export default Runtime
