import React, { useLayoutEffect, useRef } from "react"
import { Editor as LingoEditor } from "lingo3d"

interface EditorProps {
}

const Editor: React.FC<EditorProps> = () => {
    const divRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const el = divRef.current
        if (!el) return

        const editor = new LingoEditor()
        el.appendChild(editor)
        
        return () => {
            editor.remove()
        }
    }, [])

    return (
        <div ref={divRef} />
    )
}

export default Editor
