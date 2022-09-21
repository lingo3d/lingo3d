import React from "react"
import LingoToolbar from "lingo3d/lib/editor/Toolbar"
import useEditor from "../../hooks/useEditor"

const Toolbar: React.FC = () => {
  const divRef = useEditor(LingoToolbar)

  return <div ref={divRef} className="lingo3d-ui" style={{ height: "100%" }} />
}

export default Toolbar
