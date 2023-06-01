import { useEffect, useRef } from "preact/hooks"
import serialize from "../../api/serializer/serialize"
import unsafeGetValue from "../../utils/unsafeGetValue"

const Runtime = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const script = `deserialize(${JSON.stringify(serialize())})`

        const interval = setInterval(() => {
            const $eval = unsafeGetValue(iframe, "$eval")
            if (!$eval) return
            $eval(script)
            clearInterval(interval)
        }, 100)

        return () => {
            clearInterval(interval)
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
