import { useState } from "preact/hooks"
import MenuButton from "./MenuButton"
import TextBox from "./TextBox"
import useComboBox from "../hooks/useComboBox"

interface ComboBoxProps {
    options: string[]
    onEnter?: (value: string) => void
    onEscape?: (value: string) => void
    placeholder?: string
}

const ComboBox = ({
    options,
    onEnter,
    onEscape,
    placeholder
}: ComboBoxProps) => {
    const [text, setText] = useState("")
    const [filteredOptions, selected, selectNext, selectPrev] = useComboBox(
        options,
        text
    )
    const [clearCount, setClearCount] = useState(0)

    return (
        <div>
            <TextBox
                placeholder={placeholder}
                fullWidth
                debounce={0}
                clearOnChange={clearCount}
                onChange={(val) => setText(val.toLowerCase())}
                onEnter={(val) => {
                    setText("")
                    setClearCount(clearCount + 1)
                    if (!options) {
                        onEnter?.(val)
                        return
                    }
                    selected && onEnter?.(selected)
                }}
                onEscape={(val) => {
                    setText("")
                    setClearCount(clearCount + 1)
                    onEscape?.(val)
                }}
                onArrowDown={selectNext}
                onArrowUp={selectPrev}
            />
            {text && (
                <div
                    className="lingo3d-bg-dark"
                    style={{
                        position: "absolute",
                        width: "100%",
                        zIndex: 2,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        marginTop: -4,
                        maxHeight: 130,
                        overflowY: "scroll"
                    }}
                >
                    {filteredOptions.map((option) => (
                        <MenuButton
                            key={option}
                            onClick={() => {
                                setText("")
                                setClearCount(clearCount + 1)
                                onEnter?.(option)
                            }}
                            highlight={selected === option}
                        >
                            {option}
                        </MenuButton>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ComboBox
