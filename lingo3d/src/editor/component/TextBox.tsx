import { useSignal } from "@preact/signals"
import { CSSProperties, useEffect } from "preact/compat"
import CloseIcon from "./icons/CloseIcon"
import TextInput from "./TextInput"
import { CLICK_TIME } from "../../globals"

type Props = {
    style?: CSSProperties
    fullWidth?: boolean
    onChange?: (val: string) => void
    clearOnChange?: any
    placeholder?: string
    debounce?: number
    onEnter?: (value: string) => void
    onEscape?: (value: string) => void
    onArrowDown?: () => void
    onArrowUp?: () => void
}

const TextBox = ({
    style,
    fullWidth,
    onChange,
    clearOnChange,
    placeholder = "Search...",
    debounce,
    onEnter,
    onEscape,
    onArrowDown,
    onArrowUp
}: Props) => {
    const textSignal = useSignal("")

    useEffect(() => {
        textSignal.value = ""
    }, [clearOnChange])

    useEffect(() => {
        if (!textSignal.value) {
            onChange?.("")
            return
        }
        if (debounce === 0) {
            onChange?.(textSignal.value)
            return
        }
        const timeout = setTimeout(
            () => onChange?.(textSignal.value),
            debounce ?? CLICK_TIME
        )
        return () => {
            clearTimeout(timeout)
        }
    }, [textSignal.value, debounce])

    return (
        <div
            className="lingo3d-flexcenter"
            style={{
                width: "100%",
                flexShrink: 0,
                marginBottom: 8,
                ...style
            }}
        >
            <div
                style={{
                    display: "flex",
                    outline: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(255, 255, 255, 0.02",
                    width: fullWidth ? "calc(100% - 2px)" : "calc(100% - 20px)"
                }}
            >
                <TextInput
                    style={{ flexGrow: 1, paddingLeft: 4 }}
                    placeholder={placeholder}
                    textSignal={textSignal}
                    inputPadding={6}
                    onEnter={onEnter}
                    onEscape={onEscape}
                    onArrowDown={onArrowDown}
                    onArrowUp={onArrowUp}
                />
                <div
                    className="lingo3d-flexcenter"
                    style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        width: 22,
                        height: 22,
                        opacity: textSignal.value ? 1 : 0.2,
                        cursor: textSignal.value ? "pointer" : undefined
                    }}
                    onClick={() => (textSignal.value = "")}
                >
                    <CloseIcon />
                </div>
            </div>
        </div>
    )
}

export default TextBox
