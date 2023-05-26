import { useLayoutEffect, useRef } from "preact/hooks"
import usePane from "../Editor/usePane"
import mergeRefs from "../hooks/mergeRefs"
import { stopPropagation } from "../utils/stopPropagation"
import { CSSProperties } from "preact/compat"

type Props = {
    options?: Array<string>
    label?: string
    onChange?: (index: number, value: string) => void
    style?: CSSProperties
    width?: number
}

const SelectBox = ({
    options = [],
    label = "",
    onChange,
    style,
    width
}: Props) => {
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
                onChange?.(val, options[val])
            }
        }
        let i = 0
        const optionsRecord: Record<string, number> = {}
        for (const option of options) optionsRecord[option] = i++

        const cameraInput = pane.addInput(params, label, {
            options: optionsRecord
        })
        if (width)
            el.querySelector<HTMLDivElement>(".tp-lblv_v")!.style.width =
                width + "px"

        return () => {
            cameraInput.dispose()
        }
    }, [pane, options])

    return (
        <div
            ref={mergeRefs(elRef, setContainer, stopPropagation)}
            style={{ marginLeft: !label ? -20 : 0, ...style }}
        />
    )
}

export default SelectBox
