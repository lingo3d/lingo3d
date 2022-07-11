import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"

preventTreeShake(h)

type InputProps = {
    key: string
    value: any
    onChange: (value: any) => void
}

const Input = (props: InputProps) => {}

export default Input