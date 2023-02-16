import CloseIcon from "../icons/CloseIcon"
import { TabProps } from "./Tab"
import IconButton from "../IconButton"
import { Signal } from "@preact/signals"
import { useEffect } from "preact/hooks"

type CloseableTabProps = TabProps & {
    onClose?: (selected: boolean) => void
    selectedSignal: Signal<string | undefined>
}

const CloseableTab = ({
    onClose,
    children,
    selected,
    selectedSignal,
    disabled,
    id = children
}: CloseableTabProps) => {
    useEffect(() => {
        if (children && !selectedSignal.value) selectedSignal.value = children
    }, [children])

    useEffect(() => {
        if (selected) selectedSignal.value = children
    }, [selected, children])

    return (
        <div
            className="lingo3d-flexcenter"
            style={{
                opacity: disabled ? 0.1 : 1,
                pointerEvents: disabled ? "none" : "auto",
                marginLeft: 4,
                marginRight: 4,
                height: 20,
                paddingLeft: 12,
                background:
                    selectedSignal.value === id
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(255, 255, 255, 0.02)"
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
