import React from "react"
import "lingo3d/lib/editor/Editor"

interface EditorProps {
    blockKeyboard?: boolean,
    blockMouse?: boolean
}

const Editor: React.FC<EditorProps> = ({ blockKeyboard = true, blockMouse = true }) => {
    return (
        //@ts-ignore
        <lingo3d-editor block-keyboard={blockKeyboard} block-mouse={blockMouse}  />
    )
}

export default Editor