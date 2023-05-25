import { EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"

const ScriptEditor = () => {
    useInitCSS()
    useInitEditor()

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-editor lingo3d-flexcol"
            style={{
                minWidth: EDITOR_WIDTH + LIBRARY_WIDTH,
                width: "45vw"
            }}
        ></div>
    )
}

export default ScriptEditor
