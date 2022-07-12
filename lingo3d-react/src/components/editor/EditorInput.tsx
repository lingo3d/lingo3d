import React from "react"
import useEditor from "../../hooks/useEditor"

type EditorInputProps = {
    name: string
    value: any
    values?: any
    choices?: any
    onChange?: (value: any) => void
}

const EditorInput: React.FC<EditorInputProps> = (props) => {
    useEditor(EditorInput, props, true)
    return null
}

export default EditorInput