import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"

preventTreeShake(h)

type InputProps = {
    name: string
    value: any
    values?: any
    choices?: any
    onChange?: (value: any) => void
}

const Input = (props: InputProps) => {
    return null
}

export default Input