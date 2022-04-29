import React, { useLayoutEffect, useRef } from "react"
import { Editor as LingoEditor } from "lingo3d"
import { useMemoOnce } from "@lincode/hooks"

interface EditorProps {
    blockKeyboard?: boolean,
    blockMouse?: boolean
}

const Editor: React.FC<EditorProps> = ({ blockKeyboard = true, blockMouse = true }) => {
    const divRef = useRef<HTMLDivElement>(null)
    const editor = useMemoOnce(() => new LingoEditor(), editor => editor.remove())

    useLayoutEffect(() => {
        const el = divRef.current
        if (!el) return

        el.appendChild(editor)
        
        return () => {
            editor.remove()
        }
    }, [])

    useLayoutEffect(() => {
        editor.blockKeyboard = blockKeyboard
    }, [blockKeyboard])

    useLayoutEffect(() => {
        editor.blockMouse = blockMouse
    }, [blockMouse])

    return (
        <div ref={divRef} />
    )
}

export default Editor
