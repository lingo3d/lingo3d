import { pull } from "@lincode/utils"
import { Signal } from "@preact/signals"
import { useLayoutEffect } from "preact/hooks"

export type TabProps = {
    children?: string
    selected?: boolean
    selectedSignal?: Signal<Array<string>>
    disabled?: boolean
    width?: string | number
    id?: string
}

export const selectTab = (
    selectedSignal: Signal<Array<string>>,
    id: string
) => {
    if (selectedSignal.value.at(-1) === id) return
    pull(selectedSignal.value, id)
    selectedSignal.value = [...selectedSignal.value, id]
}

const Tab = ({
    children,
    selected,
    selectedSignal,
    disabled,
    width,
    id = children
}: TabProps) => {
    useLayoutEffect(() => {
        selectedSignal &&
            (selected || !selectedSignal.value.length) &&
            id &&
            selectTab(selectedSignal, id)
    }, [selected, id])

    return (
        <div
            className="lingo3d-bg lingo3d-flexcenter"
            style={{
                width,
                opacity: disabled ? 0.1 : 1,
                height: 20,
                padding: width ? undefined : 12,
                background:
                    !selectedSignal || selectedSignal.value.at(-1) === id
                        ? "rgba(255, 255, 255, 0.1)"
                        : undefined
            }}
            onClick={
                disabled || !id
                    ? undefined
                    : selectedSignal && (() => selectTab(selectedSignal, id))
            }
        >
            {children}
        </div>
    )
}

export default Tab
