import { Signal } from "@preact/signals"
import { CSSProperties, useEffect, useRef } from "preact/compat"
import { stopPropagation } from "../utils/stopPropagation"

type Props = {
    style?: CSSProperties
    className?: string
    placeholder?: string
    textSignal?: Signal<string>
}

const TextInput = ({ style, className, placeholder, textSignal }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null)

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
            <input
                ref={inputRef}
                className="lingo3d-unset"
                style={{ width: "100%", height: "100%" }}
                placeholder={placeholder}
                onInput={(e) =>
                    textSignal && (textSignal.value = e.currentTarget.value)
                }
            />
        </div>
    )
}

export default TextInput
