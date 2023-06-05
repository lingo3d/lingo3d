import TextBox from "./TextBox"

interface ComboBoxProps {
    options: string[]
}

const ComboBox = ({ options }: ComboBoxProps) => {
    return (
        <TextBox />
    )
}

export default ComboBox
