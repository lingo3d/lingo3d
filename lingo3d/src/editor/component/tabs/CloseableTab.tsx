import CloseIcon from "../icons/CloseIcon"
import { selectTab, TabProps } from "./Tab"
import IconButton from "../IconButton"
import { useEffect, useLayoutEffect } from "preact/hooks"

type CloseableTabProps = TabProps & {
    onClose?: () => void
}

const CloseableTab = ({
    onClose,
    children,
    selected,
    selectedSignal,
    disabled,
    width,
    id = children
}: CloseableTabProps) => {
    useLayoutEffect(() => {
        selectedSignal &&
            (selected || !selectedSignal.value.length) &&
            id &&
            selectTab(selectedSignal, id)
    }, [selected])

    useEffect(() => {
        if (!id) return

        return () => {
            if (!selectedSignal) return
            const isSelected = selectedSignal.value.at(-1) === id
            selectedSignal.value = selectedSignal.value.filter(
                (val) => val !== id
            )
            if (!isSelected) return
            const lastTab = selectedSignal.value.at(-1)
            lastTab && selectTab(selectedSignal, lastTab)
        }
    }, [id])

    return (
        <div
            className="lingo3d-flexcenter"
            style={{
                width,
                opacity: disabled ? 0.1 : 1,
                pointerEvents: disabled ? "none" : "auto",
                marginLeft: 4,
                marginRight: 4,
                height: 20,
                paddingLeft: 12,
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
            <div
                style={{
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
            <IconButton disabled={!onClose} onClick={onClose} borderless>
                <CloseIcon />
            </IconButton>
        </div>
    )
}

export default CloseableTab
