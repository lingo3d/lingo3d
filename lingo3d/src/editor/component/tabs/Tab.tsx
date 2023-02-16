import { Signal } from "@preact/signals"
import { useEffect } from "preact/hooks"

export type TabProps = {
    children?: string
    selected?: boolean
    selectedSignal: Signal<string | undefined>
    disabled?: boolean
    half?: boolean
    id?: string
}

const Tab = ({
    children,
    selected,
    selectedSignal,
    disabled,
    half,
    id = children
}: TabProps) => {
    useEffect(() => {
        if (children && !selectedSignal.value) selectedSignal.value = children
    }, [children])

    useEffect(() => {
        if (selected) selectedSignal.value = children
    }, [selected, children])

    return (
        <div
            className="lingo3d-bg lingo3d-flexcenter"
            style={{
                width: half ? "50%" : undefined,
                opacity: disabled ? 0.1 : 1,
                height: 20,
                padding: half ? undefined : 12,
                background:
                    selectedSignal.value === id
                        ? "rgba(255, 255, 255, 0.1)"
                        : undefined
            }}
            onClick={disabled ? undefined : () => (selectedSignal.value = id)}
        >
            <div style={{ marginTop: -2 }}>{children}</div>
        </div>
    )
}

export default Tab
