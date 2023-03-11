import { useSignal } from "@preact/signals"
import { CSSProperties, useEffect, useState } from "preact/compat"
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
    const [includeKeys, setIncludeKeys] = useState<Array<string>>()
    const filteredOptions = includeKeys ?? options

    useEffect(() => {
        const options = optionsRef.current
        if (!options) return

        if (!textSignal.value) {
            setIncludeKeys(undefined)
            return
        }
        setIncludeKeys(
            options.filter((key) =>
                key.toLowerCase().includes(textSignal.value.toLowerCase())
            )
        )
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
            inputPadding={options ? 20 : undefined}
        >
            {!!filteredOptions?.length && (
                <>
                    <div style={{ height: 10 }} />
                    <div style={{ width: "100%" }}>
                        {filteredOptions.map((option) => (
                            <MenuButton
                                key={option}
                                onClick={() => onEnter?.(option)}
                            >
                                {option}
                            </MenuButton>
                        ))}
                    </div>
                </>
            )}
        </TextInput>
    )
}

export default TextOptionsInput
