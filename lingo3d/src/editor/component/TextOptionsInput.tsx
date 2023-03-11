import { useSignal } from "@preact/signals"
import { CSSProperties, useEffect } from "preact/compat"
import useLatest from "../hooks/useLatest"
import MenuButton from "./MenuButton"
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
        >
            {options && (
                <div style={{ width: "100%" }}>
                    {options.map((option) => (
                        <MenuButton key={option}>{option}</MenuButton>
                    ))}
                </div>
            )}
        </TextInput>
    )
}

export default TextOptionsInput
