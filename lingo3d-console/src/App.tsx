import { useEffect, useState } from "react"
import { Hook, Unhook, Console, Decode } from "console-feed"
import { HookedConsole } from "console-feed/lib/definitions/Console"

const setFrameProperty = (key: string, value: any) =>
    //@ts-ignore
    window.frameElement && (window.frameElement[key] = value)

function App() {
    const [logs, setLogs] = useState<Array<any>>([])

    useEffect(() => {
        setFrameProperty(
            "$hook",
            (myConsole: typeof console, myWindow: typeof window) => {
                const handleError = (
                    message: any,
                    _: any,
                    __: any,
                    ___: any,
                    error: any
                ) => {
                    const errorLog = {
                        method: "error",
                        message: error ? error.message : message,
                        stack: error ? error.stack : "",
                        type: "error"
                    }
                    setLogs((prevLogs) => [...prevLogs, errorLog])
                }
                myWindow.onerror = handleError

                return Hook(myConsole, (log) => {
                    setLogs((currLogs) => [...currLogs, Decode(log)])
                })
            }
        )

        setFrameProperty(
            "$unhook",
            (hookedConsole: HookedConsole, myWindow: typeof window) => {
                Unhook(hookedConsole)
                myWindow.onerror = null
            }
        )
    }, [])

    return (
        <div
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%"
            }}
        >
            <Console logs={logs} variant="dark" />
        </div>
    )
}

export default App
