import React from "react"
import Toolbar from "./Toolbar"
import SceneGraph from "./SceneGraph"
import Editor from "./Editor"
import Library from "./Library"
import HUD from "./HUD"

const LingoEditor: React.FC = () => {
  return (
    <>
      <Toolbar />
      <SceneGraph />
      <Editor />
      <Library />
      <HUD />
    </>
  )
}

export default LingoEditor
