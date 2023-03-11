import { useSignal } from "@preact/signals"
import { CSSProperties, useEffect } from "preact/compat"
import useLatest from "../hooks/useLatest"
import TextInput from "./TextInput"

type Props = {
    style?: CSSProperties
    className?: string
    placeholder?: string
    autoFocus?: boolean
    onEnter?: (value: string) => void
    onEscape?: (value: string) => void
    options?: Array<string>
}

const TextOptionsInput = ({
    style,
    className,
    placeholder,
    autoFocus,
    onEnter,
    onEscape,
    options
}: Props) => {
    const optionsRef = useLatest(options)
    const textSignal = useSignal("")

    useEffect(() => {
        const options = optionsRef.current
        if (!options || !textSignal.value) return

        const timeout = setTimeout(() => {
            console.log(
                options.filter((key) =>
                    key.toLowerCase().includes(textSignal.value.toLowerCase())
                )
            )
        })
        return () => {
            clearTimeout(timeout)
        }
    }, [textSignal.value])

    return (
        <TextInput
            style={style}
            className={className}
            placeholder={placeholder}
            autoFocus={autoFocus}
            onEnter={onEnter}
            onEscape={onEscape}
            textSignal={textSignal}
        />
    )
}

export default TextOptionsInput
