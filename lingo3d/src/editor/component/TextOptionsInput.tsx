import { useSignal } from "@preact/signals"
import { CSSProperties } from "preact/compat"
import MenuButton from "./MenuButton"
import TextInput from "./TextInput"
import useComboBox from "../hooks/useComboBox"

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
    const textSignal = useSignal("")
    const [filteredOptions, selected, selectNext, selectPrev] = useComboBox(
        options,
        textSignal.value
    )

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
            onArrowDown={selectNext}
            onArrowUp={selectPrev}
            textSignal={textSignal}
            inputPadding={options ? 20 : undefined}
        >
            {!!filteredOptions.length && (
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
