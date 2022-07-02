import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import { useNodeEditor } from "../states"

preventTreeShake(h)

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

    return (
        <NodeEditor />
    )
}

register(NodeEditorParent, "lingo3d-node-editor")
