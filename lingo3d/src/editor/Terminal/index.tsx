import { useEffect, useRef } from "preact/hooks"
import { Terminal as XTerminal } from "xterm"
import "xterm/css/xterm.css"
import { WebContainer, FileSystemTree } from "@webcontainer/api"
import { FitAddon } from "xterm-addon-fit"
import { Cancellable } from "@lincode/promiselikes"

const Terminal = () => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        const fitAddon = new FitAddon()
        const terminal = new XTerminal({
            convertEol: true,
            fontSize: 11,
            theme: { background: "rgb(18, 19, 22)" }
        })
        terminal.loadAddon(fitAddon)
        terminal.open(el)
        fitAddon.fit()

        const handle = new Cancellable()
        ;(async () => {
            const webcontainerInstance = await WebContainer.boot()
            const projectFiles: FileSystemTree = {
                myproject: {
                    directory: {
                        "foo.js": {
                            file: {
                                contents: "const x = 1;"
                            }
                        }
                    }
                }
            }
            await webcontainerInstance.mount(projectFiles)

            const shellProcess = await webcontainerInstance.spawn("jsh", {
                terminal: {
                    cols: terminal.cols,
                    rows: terminal.rows
                }
            })
            shellProcess.output.pipeTo(
                new WritableStream({
                    write(data) {
                        terminal.write(data)
                    }
                })
            )
            const input = shellProcess.input.getWriter()
            terminal.onData((data) => {
                input.write(data)
            })

            const handleResize = () => {
                fitAddon.fit()
                shellProcess.resize({
                    cols: terminal.cols,
                    rows: terminal.rows
                })
            }
            window.addEventListener("resize", handleResize)
            handle.then(() => {
                webcontainerInstance.teardown()
                shellProcess.kill()
                input.abort()
                input.close()
                window.removeEventListener("resize", handleResize)
            })
        })()
        return () => {
            fitAddon.dispose()
            terminal.dispose()
            handle.cancel()
        }
    }, [])

    return (
        <div className="lingo3d-ui lingo3d-bg lingo3d-terminal">
            <div ref={elRef} className="lingo3d-xterm" />
        </div>
    )
}

export default Terminal
