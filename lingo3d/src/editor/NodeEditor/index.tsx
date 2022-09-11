import register from "preact-custom-element"
import { useNodeEditor } from "../states"

const NodeEditor = () => {
    return (
        <div
            className="lingo3d-ui"
            style={{
                overflow: "hidden",
                width: 500,
                height: "100%",
                background: "rgb(40, 41, 46)"
            }}
        >
            hello world
        </div>
    )
}

const NodeEditorParent = () => {
    const [nodeEditor] = useNodeEditor()

    if (!nodeEditor) return null

    return <NodeEditor />
}
export default NodeEditorParent

register(NodeEditorParent, "lingo3d-node-editor")
