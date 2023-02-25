import { Signal } from "@preact/signals"
import { useEffect } from "preact/hooks"
import Appendable from "../../api/core/Appendable"
import { EDITOR_WIDTH } from "../../globals"
import SearchBox from "../component/SearchBox"
import addTargetInputs from "../Editor/addTargetInputs"
import usePane from "../Editor/usePane"

type GameGraphEditPanelProps = {
    targetSignal: Signal<Appendable | undefined>
}

const GameGraphEditPanel = ({ targetSignal }: GameGraphEditPanelProps) => {
    const [pane, setContainer] = usePane()

    useEffect(() => {
        if (!targetSignal.value || !pane) return

        const handle = addTargetInputs(pane, targetSignal.value, undefined)
        return () => {
            handle.cancel()
        }
    }, [targetSignal.value, pane])

    return (
        <div
            style={{
                height: "100%",
                width: EDITOR_WIDTH,
                position: "absolute",
                left: 0,
                transition: "transform 500ms",
                transform: `translateX(${targetSignal.value ? 0 : -100}%)`,
                background: `rgb(${18 * 0.75}, ${19 * 0.75}, ${22 * 0.75})`,
                padding: 8
            }}
        >
            <SearchBox fullWidth />
            <div ref={setContainer} />
        </div>
    )
}

export default GameGraphEditPanel
