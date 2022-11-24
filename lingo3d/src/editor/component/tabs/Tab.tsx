import useTab from "./useTab"

export type TabProps = {
    children?: string
    selected?: boolean
    disabled?: boolean
    half?: boolean
}

const Tab = ({ children, selected, disabled, half }: TabProps) => {
    const { selectedSignal } = useTab(children, selected, disabled)

    return (
        <div
            className="lingo3d-bg lingo3d-flexcenter"
            style={{
                width: half ? "50%" : undefined,
                opacity: disabled ? 0.1 : 1,
                height: 20,
                padding: half ? undefined : 12,
                background:
                    selectedSignal.value === children
                        ? "rgba(255, 255, 255, 0.1)"
                        : undefined
            }}
            onClick={
                disabled ? undefined : () => (selectedSignal.value = children)
            }
        >
            <div style={{ marginTop: -2 }}>{children}</div>
        </div>
    )
}

export default Tab
