import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import Toolbar from "../Toolbar"
import SceneGraph from "../SceneGraph"
import Editor from "../Editor"
import NodeEditor from "../NodeEditor"
import Library from "../Library"
import HUD from "../HUD"
preventTreeShake(h)

const LingoEditor = () => {
    return (
        <>
            <Toolbar />
            <SceneGraph />
            <Editor />
            <NodeEditor />
            <Library />
            <HUD />
        </>
    )
}
export default LingoEditor

register(LingoEditor, "lingo3d-lingoeditor")
