import { useEffect, useRef } from "preact/hooks"
import serialize from "../../api/serializer/serialize"
import unsafeGetValue from "../../utils/unsafeGetValue"
import useSyncState from "../hooks/useSyncState"
import { getScriptCompile } from "../../states/useScriptCompile"

const Runtime = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const scriptCompile = useSyncState(getScriptCompile)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe || scriptCompile?.raw) return

        const script =
            scriptCompile?.compiled ??
            `deserialize(${JSON.stringify(serialize())})`

        const interval = setInterval(() => {
            const $eval = unsafeGetValue(iframe, "$eval")
            if (!$eval) return
            $eval(script)
            clearInterval(interval)
        }, 100)

        return () => {
            clearInterval(interval)
        }
    }, [scriptCompile])

    return (
        <iframe
            ref={iframeRef}
            style={{ border: "none", flexGrow: 1 }}
            src="runtime/index.html"
        />
    )
}

export default Runtime
