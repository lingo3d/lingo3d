import React from "react"
import "lingo3d/lib/editor"

const LingoEditor: React.FC = () => {
    //@ts-ignore
    return <><lingo3d-toolbar /><lingo3d-scenegraph /><lingo3d-editor /><lingo3d-library /></>
}

export default LingoEditor