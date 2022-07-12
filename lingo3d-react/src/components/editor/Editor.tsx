import React from "react"
import LingoEditor from "lingo3d/lib/editor/Editor"
import useEditor from "../../hooks/useEditor"

interface EditorProps {
  keyboard?: "enabled" | "disabled"
  mouse?: "enabled" | "disabled"
}

const Editor: React.FC<EditorProps> = (props) => {
  const divRef = useEditor(LingoEditor, props)

  return <div ref={divRef} className="lingo3d-ui" style={{ height: "100%" }} />
}

export default Editor
