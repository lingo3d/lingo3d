import { Signal } from "@preact/signals"
import { ComponentChild } from "preact"
import { CSSProperties, useEffect, useRef } from "preact/compat"
import { stopPropagation } from "../utils/stopPropagation"

type Props = {
    style?: CSSProperties
    className?: string
    placeholder?: string
    textSignal?: Signal<string>
    autoFocus?: boolean
    onEnter?: (value: string) => void
    onEscape?: (value: string) => void
    onArrowDown?: () => void
    onArrowUp?: () => void
    children?: ComponentChild
    inputPadding?: number
}

const TextInput = ({
    style,
    className,
    placeholder,
    textSignal,
    autoFocus,
    onEnter,
    onEscape,
    onArrowDown,
    onArrowUp,
    children,
    inputPadding
}: Props) => {
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const el = inputRef.current
        if (!autoFocus || !el) return
        const timeout = setTimeout(() => el.focus())
        return () => {
            clearTimeout(timeout)
        }
    }, [autoFocus])

    useEffect(() => {
        if (textSignal?.value || !inputRef.current) return
        inputRef.current.value = ""
    }, [textSignal?.value])

    return (
        <div
            ref={stopPropagation}
            style={{ minWidth: 50, minHeight: 20, ...style }}
            className={className}
        >
            <div
                style={{
                    paddingLeft: inputPadding,
                    paddingRight: inputPadding,
                    width: "100%",
                    height: "100%"
                }}
            >
                <input
                    ref={inputRef}
                    className="lingo3d-unset"
                    style={{ width: "100%", height: "100%" }}
                    placeholder={placeholder}
                    autocomplete="off"
                    onInput={(e) =>
                        textSignal && (textSignal.value = e.currentTarget.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter")
                            onEnter?.(textSignal?.value ?? "")
                        else if (e.key === "Escape")
                            onEscape?.(textSignal?.value ?? "")
                        else if (e.key === "ArrowDown") onArrowDown?.()
                        else if (e.key === "ArrowUp") onArrowUp?.()
                    }}
                />
            </div>
            {children}
        </div>
    )
}

export default TextInput
