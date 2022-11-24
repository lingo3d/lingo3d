import CloseIcon from "../icons/CloseIcon"
import { TabProps } from "./Tab"
import useTab from "./useTab"
import IconButton from "../IconButton"

type CloseableTabProps = TabProps & {
    onClose?: (selected: boolean) => void
}

const CloseableTab = ({
    onClose,
    children,
    selected,
    disabled,
    id = children
}: CloseableTabProps) => {
    const { selectedSignal } = useTab(id, selected, disabled)

    return (
        <div
            className="lingo3d-bg lingo3d-flexcenter"
            style={{
                opacity: disabled ? 0.1 : 1,
                pointerEvents: disabled ? "none" : "auto",
                marginLeft: 4,
                marginRight: 4,
                height: 20,
                paddingLeft: 12,
                background:
                    selectedSignal.value === id
                        ? "rgba(255, 255, 255, 0.1)"
                        : undefined
            }}
            onClick={disabled ? undefined : () => (selectedSignal.value = id)}
        >
            <div
                style={{
                    marginTop: -2,
                    minWidth: 30,
                    maxWidth: 100,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden"
                }}
            >
                {children}
            </div>
            <div style={{ width: 4 }} />
            <IconButton
                disabled={!onClose}
                onClick={() => onClose?.(selectedSignal.value === id)}
            >
                <CloseIcon />
            </IconButton>
        </div>
    )
}

export default CloseableTab
