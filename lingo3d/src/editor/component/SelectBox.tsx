import { useLayoutEffect, useRef } from "preact/hooks"
import usePane from "../Editor/usePane"
import mergeRefs from "../hooks/mergeRefs"
import { stopPropagation } from "../utils/stopPropagation"

type Props = {
    options?: Array<string>
    label?: string
    onChange?: (index: number) => void
}

const SelectBox = ({ options = [], label = "", onChange }: Props) => {
    const [pane, setContainer] = usePane()
    const elRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const el = elRef.current
        if (!pane || !el) return

        let index = -1
        const params = {
            get [label]() {
                return index
            },
            set [label](val: number) {
                index = val
                onChange?.(val)
            }
        }
        let i = 0
        const optionsRecord: Record<string, number> = {}
        for (const option of options) optionsRecord[option] = i++

        const cameraInput = pane.addInput(params, label, {
            options: optionsRecord
        })
        el.querySelector<HTMLDivElement>(".tp-lblv_v")!.style.width = "100px"

        return () => {
            cameraInput.dispose()
        }
    }, [pane, options])

    return (
        <div
            ref={mergeRefs(elRef, setContainer, stopPropagation)}
            style={{ marginLeft: -20 }}
        />
    )
}

export default SelectBox
