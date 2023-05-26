import { Signal } from "@preact/signals"
import { useEffect, useState } from "preact/hooks"
import Appendable from "../../display/core/Appendable"
import getStaticProperties from "../../display/utils/getStaticProperties"
import { EDITOR_WIDTH } from "../../globals"
import Drawer from "../component/Drawer"
import TextBox from "../component/TextBox"
import addTargetInputs from "../Editor/addTargetInputs"
import usePane from "../Editor/usePane"

type GameGraphEditPanelProps = {
    targetSignal: Signal<Appendable | undefined>
}

const GameGraphEditPanel = ({ targetSignal }: GameGraphEditPanelProps) => {
    const [pane, setContainer] = usePane()
    const [includeKeys, setIncludeKeys] = useState<Array<string>>()

    const [target, setTarget] = useState(targetSignal.value)
    useEffect(() => {
        if (targetSignal.value) {
            setTarget(targetSignal.value)
            return
        }
        const timeout = setTimeout(() => setTarget(undefined), 500)
        return () => {
            clearTimeout(timeout)
        }
    }, [targetSignal.value])

    useEffect(() => {
        if (!target || !pane) return

        const handle = addTargetInputs(
            pane,
            target,
            includeKeys,
            undefined,
            true
        )
        return () => {
            handle.cancel()
        }
    }, [target, pane, includeKeys])

    return (
        <Drawer
            show={!!targetSignal.value}
            onHide={() => (targetSignal.value = undefined)}
            className="lingo3d-flexcol lingo3d-bg"
            width={EDITOR_WIDTH + 50}
        >
            <TextBox
                style={{ marginTop: 8 }}
                onChange={(val) => {
                    if (!val || !targetSignal.value) {
                        setIncludeKeys(undefined)
                        return
                    }
                    val = val.toLowerCase()
                    setIncludeKeys(
                        Object.keys(
                            getStaticProperties(targetSignal.value).schema
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
        </Drawer>
    )
}

export default GameGraphEditPanel
