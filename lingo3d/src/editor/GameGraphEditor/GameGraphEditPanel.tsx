import { Signal } from "@preact/signals"
import { useEffect, useState } from "preact/hooks"
import Appendable from "../../api/core/Appendable"
import { EDITOR_WIDTH } from "../../globals"
import unsafeGetValue from "../../utils/unsafeGetValue"
import SearchBox from "../component/SearchBox"
import addTargetInputs from "../Editor/addTargetInputs"
import usePane from "../Editor/usePane"

type GameGraphEditPanelProps = {
    targetSignal: Signal<Appendable | undefined>
}

const GameGraphEditPanel = ({ targetSignal }: GameGraphEditPanelProps) => {
    const [pane, setContainer] = usePane()
    const [includeKeys, setIncludeKeys] = useState<Array<string>>()

    useEffect(() => {
        if (!targetSignal.value || !pane) return

        const handle = addTargetInputs(
            pane,
            targetSignal.value,
            includeKeys,
            undefined,
            true
        )
        return () => {
            handle.cancel()
        }
    }, [targetSignal.value, pane, includeKeys])

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
            <SearchBox
                style={{ marginTop: 8 }}
                onChange={(val) => {
                    if (!val || !targetSignal.value) {
                        setIncludeKeys(undefined)
                        return
                    }
                    val = val.toLowerCase()
                    setIncludeKeys(
                        Object.keys(
                            unsafeGetValue(targetSignal.value, "constructor")
                                .schema
                        ).filter((key) => key.toLowerCase().includes(val))
                    )
                }}
                clearOnChange={targetSignal.value}
            />
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
