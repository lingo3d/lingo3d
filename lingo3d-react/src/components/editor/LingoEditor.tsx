import React from "react"
import LingoEditor from "lingo3d/lib/editor/LingoEditor"
import useEditor from "../../hooks/useEditor"

const Editor: React.FC = () => {
  const divRef = useEditor(LingoEditor, { embedded: true })

  return <div ref={divRef} style={{ width: "100vw", height: "100vh" }} />
}

export default Editor
