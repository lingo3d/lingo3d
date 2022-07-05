import React from "react"
import LingoLibrary from "lingo3d/lib/editor/Library"
import useEditor from "../../hooks/useEditor"

const Library: React.FC = () => {
    const divRef = useEditor(LingoLibrary)

    return (
          <div ref={divRef} className="lingo3d-ui" style={{ height: "100%" }} />
    )
}

export default Library