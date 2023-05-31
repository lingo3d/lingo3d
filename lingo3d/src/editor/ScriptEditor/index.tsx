import { useSignal } from "@preact/signals"
import {
    BACKGROUND_COLOR,
    EDITOR_WIDTH,
    LIBRARY_WIDTH,
    SCENEGRAPH_WIDTH
} from "../../globals"
import { getScripts, pullScripts } from "../../states/useScripts"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import useSyncState from "../hooks/useSyncState"
import makeMonaco from "./makeMonaco"
import { editor, languages } from "monaco-editor"
import data from "monaco-themes/themes/Sunburst.json"
import { getScript, setScript } from "../../states/useScript"
import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import { useLayoutEffect, useMemo } from "preact/hooks"
import { selectTab } from "../component/tabs/Tab"
import {
    addScriptsUnsaved,
    deleteScriptsUnsaved,
    getScriptsUnsaved
} from "../../states/useScriptsUnsaved"
import { editorUrlPtr } from "../../pointers/assetsPathPointers"

const { Monaco } = makeMonaco()

Object.assign(data.colors, {
    "editor.background": BACKGROUND_COLOR
    // "editorSuggestWidget.background": "",
    // "editorSuggestWidget.selectedBackground": ""
})
editor.defineTheme("lingo3d", data as any)

fetch(editorUrlPtr[0] + "lingo3d.d.ts").then(async (res) =>
    languages.typescript.typescriptDefaults.addExtraLib(
        await res.text(),
        "lingo3d.d.ts"
    )
)

const ScriptEditor = () => {
    useInitCSS()
    useInitEditor()

    const selectedSignal = useSignal<Array<string>>([])
    const script = useSyncState(getScript)
    const scripts = useSyncState(getScripts)
    const scriptsUnsavedPtr = useSyncState(getScriptsUnsaved)

    useLayoutEffect(() => {
        const uuid = script?.uuid
        uuid && selectTab(selectedSignal, uuid)
    }, [script])

    useLayoutEffect(() => {
        const uuid = selectedSignal.value.at(-1)
        setScript(scripts.find((script) => script.uuid === uuid))
    }, [selectedSignal.value])

    const monacoFiles = useMemo(() => {
        const result: Record<string, string> = {}
        for (const script of scripts) result[script.uuid] = script.code
        return result
    }, [scripts, scriptsUnsavedPtr])

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-editor lingo3d-flexcol"
            style={{ width: EDITOR_WIDTH + LIBRARY_WIDTH + SCENEGRAPH_WIDTH }}
        >
            <AppBar>
                {scripts.map((script) => (
                    <CloseableTab
                        selectedSignal={selectedSignal}
                        key={script.uuid}
                        id={script.uuid}
                        onClose={() => pullScripts(script)}
                        unsaved={scriptsUnsavedPtr[0].has(script)}
                    >
                        {script.name}
                    </CloseableTab>
                ))}
            </AppBar>
            <Monaco
                className="lingo3d-nofix"
                style={{ flexGrow: 1 }}
                theme="lingo3d"
                language={script?.language.toLowerCase()}
                fontSize={12}
                files={monacoFiles}
                file={script?.uuid}
                onChange={() => addScriptsUnsaved(script!)}
                onSave={(code) => {
                    script!.code = code
                    deleteScriptsUnsaved(script!)
                }}
                // onSaveAll={handleSaveAll}
            />
        </div>
    )
}

export default ScriptEditor
