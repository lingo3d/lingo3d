import React from "react"
import "lingo3d/lib/editor"

interface EditorProps {
    keyboard?: "enabled" | "disabled",
    mouse?: "enabled" | "disabled" 
}

const Editor: React.FC<EditorProps> = ({ keyboard, mouse }) => {
    return (
        //@ts-ignore
        <lingo3d-editor keyboard={keyboard} mouse={mouse}  />
    )
}

export default Editor