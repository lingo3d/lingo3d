import { useEffect, useRef } from "preact/hooks"
import { runtimeIframeScriptSystem } from "../../systems/runtimeIframeScriptSystem"
import serialize from "../../api/serializer/serialize"

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
