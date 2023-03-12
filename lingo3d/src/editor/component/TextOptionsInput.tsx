import { useSignal } from "@preact/signals"
import { CSSProperties, useLayoutEffect, useState } from "preact/compat"
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
    const [selected, setSelected] = useState("")

    useLayoutEffect(() => {
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

    useLayoutEffect(() => {
        if (!optionsRef.current || !filteredOptions || !textSignal.value) return

        setSelected(filteredOptions[0])

        return () => {
            setSelected("")
        }
    }, [textSignal.value, filteredOptions])

    return (
        <TextInput
            style={style}
            className={className}
            placeholder={placeholder}
            autoFocus={autoFocus}
            onEnter={(val) => {
                if (!options) {
                    onEnter?.(val)
                    return
                }
                selected && onEnter?.(selected)
            }}
            onEscape={onEscape}
            onArrowDown={() => {
                if (!filteredOptions) return
                const index = filteredOptions.indexOf(selected) + 1
                setSelected(
                    filteredOptions[index >= filteredOptions.length ? 0 : index]
                )
            }}
            onArrowUp={() => {
                if (!filteredOptions) return
                const index = filteredOptions.indexOf(selected) - 1
                setSelected(
                    filteredOptions[
                        index < 0 ? filteredOptions.length - 1 : index
                    ]
                )
            }}
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
                                highlight={selected === option}
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
