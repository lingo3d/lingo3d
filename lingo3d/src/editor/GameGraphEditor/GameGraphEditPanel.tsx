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

        const handle = addTargetInputs(
            pane,
            targetSignal.value,
            undefined,
            undefined,
            {
                onChange: (name, active) => {
                    
                }
            }
        )
        return () => {
            handle.cancel()
        }
    }, [targetSignal.value, pane])

    return (
        <div
            className="lingo3d-flexcol"
            style={{
                height: "100%",
                width: EDITOR_WIDTH,
                position: "absolute",
                left: 0,
                transition: "transform 500ms",
                transform: `translateX(${targetSignal.value ? 0 : -100}%)`,
                background: `rgb(${18 * 0.75}, ${19 * 0.75}, ${22 * 0.75})`
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: 6,
                    padding: 8,
                    paddingBottom: 0
                }}
            >
                <SearchBox
                    fullWidth
                    style={{ width: undefined, flexGrow: 1 }}
                />
                <div
                    className="lingo3d-flexcenter"
                    style={{
                        height: 22,
                        padding: 4,
                        background: "rgba(255, 255, 255, 0.1)"
                    }}
                    onClick={() => (targetSignal.value = undefined)}
                >
                    close
                </div>
            </div>
            <div
                ref={setContainer}
                style={{
                    overflowY: "scroll",
                    flexGrow: 1,
                    paddingLeft: 8,
                    paddingRight: 8
                }}
            />
        </div>
    )
}

export default GameGraphEditPanel
