import React from "react"
import LingoToolbar from "lingo3d/lib/editor/Toolbar"
import useEditor from "../../hooks/useEditor"

type ButtonOptions = {
  hidden?: boolean
  onClick?: () => void
}

interface ToolbarProps {
  buttons?: {
    openJSON?: ButtonOptions
    exportJSON?: ButtonOptions
    exportReact?: ButtonOptions
    exportVue?: ButtonOptions
  }
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const divRef = useEditor(LingoToolbar, props)

  return <div ref={divRef} className="lingo3d-ui" style={{ height: "100%" }} />
}

export default Toolbar
