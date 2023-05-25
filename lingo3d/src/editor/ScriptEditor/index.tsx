import {
    BACKGROUND_COLOR,
    EDITOR_WIDTH,
    LIBRARY_WIDTH,
    SCENEGRAPH_WIDTH
} from "../../globals"
import { getScriptFiles } from "../../states/useScriptFiles"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import useSyncState from "../hooks/useSyncState"
import makeMonaco from "./makeMonaco"
import { editor } from "monaco-editor"
import data from "monaco-themes/themes/Sunburst.json"

const { Monaco, controls } = makeMonaco()

Object.assign(data.colors, {
    "editor.background": BACKGROUND_COLOR
    // "editorSuggestWidget.background": "",
    // "editorSuggestWidget.selectedBackground": ""
})
editor.defineTheme("lingo3d", data as any)

const ScriptEditor = () => {
    useInitCSS()
    useInitEditor()

    const [scriptFiles] = useSyncState(getScriptFiles)

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-editor lingo3d-flexcol"
            style={{ width: EDITOR_WIDTH + LIBRARY_WIDTH + SCENEGRAPH_WIDTH }}
        >
            <Monaco
                className="lingo3d-absfull"
                theme="lingo3d"
                fontSize={13}
                files={scriptFiles}
                file={Object.keys(scriptFiles)[0]}
                // onSave={handleSave}
                // onSaveAll={handleSaveAll}
            />
        </div>
    )
}

export default ScriptEditor
