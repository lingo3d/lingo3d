import "./App.css"
import { useEffect, useRef, useState } from "react"
import { Hook, Unhook, Console, Decode } from "console-feed"

const setFrameProperty = (key: string, value: any) =>
    //@ts-ignore
    window.frameElement && (window.frameElement[key] = value)

function App() {
    const [logs, setLogs] = useState<Array<any>>([])
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setFrameProperty("$hook", (myConsole: typeof console) =>
            Hook(myConsole, (log) => {
                const decoded = Decode(log)
                // !decoded.data?.[0]?.startsWith("THREE.") &&
                setLogs((currLogs) => [...currLogs, decoded])
            })
        )
        setFrameProperty("$unhook", Unhook)
    }, [])

    useEffect(() => {
        window.scrollTo(0, document.documentElement.scrollHeight)
    }, [logs])

    return (
        <div
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%"
            }}
            ref={containerRef}
        >
            <Console logs={logs} variant="dark" />
        </div>
    )
}

export default App
