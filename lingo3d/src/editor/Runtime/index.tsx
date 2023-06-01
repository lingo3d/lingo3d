import { useEffect, useRef } from "preact/hooks"
import serialize from "../../api/serializer/serialize"
import unsafeGetValue from "../../utils/unsafeGetValue"
import useSyncState from "../hooks/useSyncState"
import { getScriptCompile } from "../../states/useScriptCompile"
import getUUID from "../../memo/getUUID"

const Runtime = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const scriptCompile = useSyncState(getScriptCompile)

    useEffect(() => {
        if (scriptCompile?.raw) return

        const iframe = iframeRef.current
        if (!iframe) return

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
            key={scriptCompile && getUUID(scriptCompile)}
            style={{ border: "none", flexGrow: 1 }}
            src="runtime/index.html"
        />
    )
}

export default Runtime
