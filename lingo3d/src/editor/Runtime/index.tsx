import { useEffect, useRef } from "preact/hooks"
import { serialize } from "../../runtime"
import { runtimeIframeScriptSystem } from "../../systems/runtimeIframeScriptSystem"

const Runtime = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const script = `deserialize(${JSON.stringify(serialize())})`
        runtimeIframeScriptSystem.add(iframe, { script })
        return () => {
            runtimeIframeScriptSystem.delete(iframe)
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
