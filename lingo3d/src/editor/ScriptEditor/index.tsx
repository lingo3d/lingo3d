import { EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"

const ScriptEditor = () => {
    useInitCSS()
    useInitEditor()

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-editor lingo3d-flexcol"
            style={{ width: EDITOR_WIDTH + LIBRARY_WIDTH }}
        ></div>
    )
}

export default ScriptEditor
