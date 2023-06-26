import { useEffect, useRef, useState } from "preact/hooks"
import serialize from "../../api/serializer/serialize"
import unsafeGetValue from "../../utils/unsafeGetValue"
import useSyncState from "../hooks/useSyncState"
import { getScriptCompile } from "../../states/useScriptCompile"
import { busyCountPtr } from "../../pointers/busyCountPtr"

const Runtime = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const scriptCompile = useSyncState(getScriptCompile)
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        if (!busy) return
        busyCountPtr[0]++
        return () => {
            busyCountPtr[0]--
        }
    }, [busy])

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe || scriptCompile?.raw) return

        const script =
            scriptCompile?.compiled ??
            `lingo3d.deserialize(${JSON.stringify(serialize())})`

        const interval = setInterval(() => {
            const $eval = unsafeGetValue(iframe, "$eval")
            if (!$eval) return
            $eval(script)
            clearInterval(interval)
        }, 100)

        const busyInterval = setInterval(() => {
            const $lingo3d = unsafeGetValue(iframe, "$lingo3d")
            setBusy($lingo3d?.isBusy() ?? true)
        }, 100)

        return () => {
            clearInterval(interval)
            clearInterval(busyInterval)
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
