import { Cancellable } from "@lincode/promiselikes"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "xterm/css/xterm.css"
import { BACKGROUND_COLOR } from "../../../globals"

export const loadTerminal = (el: HTMLDivElement, handle: Cancellable) => {
    const fitAddon = new FitAddon()
    const terminal = new Terminal({
        convertEol: true,
        fontSize: 11,
        theme: { background: BACKGROUND_COLOR }
    })
    terminal.loadAddon(fitAddon)
    terminal.open(el)
    fitAddon.fit()

    const handleResize = () => fitAddon.fit()
    window.addEventListener("resize", handleResize)

    handle.then(() => {
        fitAddon.dispose()
        terminal.dispose()
        window.removeEventListener("resize", handleResize)
    })
}
