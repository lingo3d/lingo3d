import React, { PropsWithChildren } from "react"
import LingoCustomEditor from "lingo3d/lib/editor/CustomEditor"
import useEditor from "../../hooks/useEditor"

const CustomEditor: React.FC<PropsWithChildren> = ({ children, ...props }) => {
  const divRef = useEditor(LingoCustomEditor, props)

  return (
    <div ref={divRef} className="lingo3d-ui">
      {children}
    </div>
  )
}

export default CustomEditor
