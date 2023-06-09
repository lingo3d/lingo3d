import { useSignal } from "@preact/signals"
import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import OutputConsole from "./OutputConsole"
import Terminal from "./Terminal"

const Console = () => {
    const selectedSignal = useSignal<Array<string>>([])

    return (
        <div className="lingo3d-ui lingo3d-bg lingo3d-flexcol">
            <AppBar>
                <CloseableTab selectedSignal={selectedSignal}>
                    console
                </CloseableTab>
                <CloseableTab selectedSignal={selectedSignal}>
                    terminal
                </CloseableTab>
            </AppBar>
            {selectedSignal.value.at(-1) === "console" ? (
                <OutputConsole />
            ) : (
                <Terminal />
            )}
        </div>
    )
}

export default Console
