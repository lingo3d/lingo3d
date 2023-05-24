import { Cancellable } from "@lincode/promiselikes"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "xterm/css/xterm.css"
import { WebContainer } from "@webcontainer/api"

export const loadTerminal = async (el: HTMLDivElement, handle: Cancellable) => {
    const fitAddon = new FitAddon()
    const terminal = new Terminal({
        convertEol: true,
        fontSize: 11,
        theme: { background: "rgb(18, 19, 22)" }
    })
    terminal.loadAddon(fitAddon)
    terminal.open(el)
    fitAddon.fit()

    const webcontainerInstance = await WebContainer.boot()
    // const projectFiles: FileSystemTree = {
    //     myproject: {
    //         directory: {
    //             "foo.js": {
    //                 file: {
    //                     contents: "const x = 1;"
    //                 }
    //             }
    //         }
    //     }
    // }
    // await webcontainerInstance.mount(projectFiles)

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
        fitAddon.dispose()
        terminal.dispose()
        webcontainerInstance.teardown()
        shellProcess.kill()
        input.abort()
        input.close()
        window.removeEventListener("resize", handleResize)
    })
}
