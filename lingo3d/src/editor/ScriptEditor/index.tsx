import { useSignal } from "@preact/signals"
import {
    BACKGROUND_COLOR,
    EDITOR_WIDTH,
    LIBRARY_WIDTH,
    SCENEGRAPH_WIDTH
} from "../../globals"
import { getScripts, deleteScripts } from "../../states/useScripts"
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
import { getWorldPlay } from "../../states/useWorldPlay"
import { uuidMap } from "../../collections/idCollections"
import Script from "../../display/Script"
import compileAndRun from "./compileAndRun"
import { worldPlayPtr } from "../../pointers/worldPlayPtr"

const { Monaco, controls } = makeMonaco()

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
    const scriptsPtr = useSyncState(getScripts)
    const scriptsUnsavedPtr = useSyncState(getScriptsUnsaved)

    useLayoutEffect(() => {
        if (!script) return

        const handle = getWorldPlay(
            (val) => val === "script" && controls.saveAll()
        )
        return () => {
            handle.cancel()
        }
    }, [script])

    useLayoutEffect(() => {
        const uuid = script?.uuid
        uuid && selectTab(selectedSignal, uuid)
    }, [script])

    const scriptsArray = useMemo(() => Array.from(scriptsPtr[0]), [scriptsPtr])

    useLayoutEffect(() => {
        const uuid = selectedSignal.value.at(-1)
        setScript(scriptsArray.find((script) => script.uuid === uuid))
    }, [selectedSignal.value, scriptsArray])

    const monacoFiles = useMemo(() => {
        const monacoFiles: Record<string, string> = {}
        for (const script of scriptsArray)
            monacoFiles[script.uuid] = script.code
        return monacoFiles
    }, [scriptsArray])

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-editor lingo3d-flexcol"
            style={{ width: EDITOR_WIDTH + LIBRARY_WIDTH + SCENEGRAPH_WIDTH }}
        >
            <AppBar>
                {scriptsArray.map((script) => (
                    <CloseableTab
                        selectedSignal={selectedSignal}
                        key={script.uuid}
                        id={script.uuid}
                        onClose={() => deleteScripts(script)}
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
                    worldPlayPtr[0] === "script" && compileAndRun(script!.code)
                }}
                onSaveAll={(entries) => {
                    for (const [uri, code] of entries) {
                        const script = uuidMap.get(uri.slice(1)) as Script
                        script.code = code
                        deleteScriptsUnsaved(script)
                    }
                    worldPlayPtr[0] === "script" && compileAndRun(script!.code)
                }}
            />
        </div>
    )
}

export default ScriptEditor
