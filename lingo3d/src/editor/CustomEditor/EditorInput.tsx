import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"

preventTreeShake(h)

type EditorInputProps = {
    name: string
    value: any
    values?: any
    choices?: any
    onChange?: (value: any) => void
}

const EditorInput = (props: EditorInputProps) => {
    return null
}

export default EditorInput