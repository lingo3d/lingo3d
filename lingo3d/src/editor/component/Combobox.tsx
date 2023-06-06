import { useState } from "preact/hooks"
import MenuButton from "./MenuButton"
import TextBox from "./TextBox"
import useComboBox from "../hooks/useComboBox"

interface ComboBoxProps {
    options: string[]
}

const ComboBox = ({ options }: ComboBoxProps) => {
    const [text, setText] = useState("")
    const [filteredOptions, selected, selectNext, selectPrev] = useComboBox(
        options,
        text
    )

    return (
        <div>
            <TextBox
                fullWidth
                debounce={0}
                onChange={(val) => setText(val.toLowerCase())}
            />
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
                    <MenuButton key={option}>{option}</MenuButton>
                ))}
            </div>
        </div>
    )
}

export default ComboBox
