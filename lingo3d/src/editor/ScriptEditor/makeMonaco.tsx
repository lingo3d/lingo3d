import {
    editor,
    Uri,
    KeyMod,
    KeyCode,
    IKeyboardEvent,
    Range,
    IRange,
    IScrollEvent
} from "monaco-editor/esm/vs/editor/editor.api"
import { splitFileName } from "@lincode/utils"
import { useRef, useEffect, useState } from "preact/hooks"
import useResizeObserver from "../hooks/useResizeObserver"

type SuggestionChangeEvent = {
    show: boolean
    suggestions: Array<string>
    focused: string
}

const noSuggestion: SuggestionChangeEvent = {
    show: false,
    suggestions: [],
    focused: ""
}

const defaultLanguages: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    html: "html",
    css: "css",
    json: "json"
}
const defaultFiles = { "app.jsx": Promise.resolve("") }
const defaultFile = "app.jsx"

export default () => {
    let currentModel: editor.ITextModel | null = null
    let currentEditor: editor.IStandaloneCodeEditor | undefined
    let currentSaveAll: (() => void | Promise<any>) | undefined
    let currentOnSave: ((code: string, uri: string) => void) | undefined
    let currentOnUndo: (() => void) | undefined
    let currentOnRedo: (() => void) | undefined
    let currentFocused = false

    const currentDispose = () => {
        currentModel = null
        currentEditor = undefined
        currentSaveAll = undefined
        currentOnSave = undefined
        currentOnUndo = undefined
        currentOnRedo = undefined
        currentFocused = false
    }

    const Monaco: React.FC<{
        style?: React.CSSProperties
        className?: string
        theme?: string
        minimap?: boolean
        fontSize?: number
        language?: string
        languages?: Record<string, string>
        files?: Record<string, string | Promise<string>>
        file?: string
        onSuggestionChange?: (e: SuggestionChangeEvent) => void
        onChange?: (e: editor.IModelContentChangedEvent) => void
        onModelChange?: (e: editor.IModelChangedEvent) => void
        onCursorPositionChange?: (e: editor.ICursorPositionChangedEvent) => void
        onScrollChange?: (e: IScrollEvent) => void
        onSaveAll?: (entries: Array<[string, string]>) => void | Promise<any>
        onSave?: (code: string, uri: string) => void
        onUndo?: () => void
        onRedo?: () => void
        onFocus?: () => void
        onBlur?: () => void
        onKeyDown?: (e: IKeyboardEvent) => void
        onContextMenu?: (e: editor.IEditorMouseEvent) => void
    }> = ({
        style,
        className,
        theme,
        minimap = false,
        fontSize,
        language,
        languages = defaultLanguages,
        files = defaultFiles,
        file = defaultFile,
        onSuggestionChange,
        onChange,
        onModelChange,
        onCursorPositionChange,
        onScrollChange,
        onSaveAll,
        onSave,
        onUndo,
        onRedo,
        onFocus,
        onBlur,
        onKeyDown,
        onContextMenu
    }) => {
        const editorDivRef = useRef<HTMLDivElement>(null)

        currentOnSave = onSave
        currentOnUndo = onUndo
        currentOnRedo = onRedo

        useEffect(() => {
            currentEditor?.updateOptions({
                minimap: { enabled: minimap },
                fontSize
            })
        }, [minimap, fontSize])

        useEffect(() => {
            currentEditor && theme && editor.setTheme(theme)
        }, [theme])

        const programmaticSetValueRef = useRef(false)

        useEffect(() => {
            const el = editorDivRef.current!

            const editorInstance = (currentEditor = editor.create(el, {
                theme,
                minimap: { enabled: minimap },
                fontSize,
                language,
                contextmenu: false,
                tabSize: 2
            }))

            editorInstance.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => {
                const model = editorInstance.getModel()
                model && currentOnSave?.(model.getValue(), model.uri.path)
            })

            editorInstance.addCommand(
                KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyS,
                (currentSaveAll = () => {
                    const entries: Array<[string, string]> = []
                    if (filesRef.current)
                        for (const key of Object.keys(filesRef.current)) {
                            const model = editor.getModel(Uri.parse(key))
                            model &&
                                entries.push([model.uri.path, model.getValue()])
                        }
                    return onSaveAll?.(entries)
                })
            )

            editorInstance.addCommand(KeyMod.CtrlCmd | KeyCode.Enter, () => {
                editorInstance.trigger(
                    "monaco",
                    "editor.action.insertLineAfter",
                    undefined
                )
            })

            editorInstance.addCommand(KeyMod.CtrlCmd | KeyCode.KeyZ, () => {
                currentOnUndo?.()
                editorInstance.trigger("monaco", "undo", undefined)
            })

            editorInstance.addCommand(KeyMod.CtrlCmd | KeyCode.KeyY, () => {
                currentOnRedo?.()
                editorInstance.trigger("monaco", "redo", undefined)
            })

            editorInstance.addCommand(
                KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyZ,
                () => {
                    currentOnRedo?.()
                    editorInstance.trigger("monaco", "redo", undefined)
                }
            )

            editorInstance.onDidFocusEditorText(() => (currentFocused = true))
            editorInstance.onDidBlurEditorText(() => (currentFocused = false))

            onFocus && editorInstance.onDidFocusEditorText(onFocus)
            onBlur && editorInstance.onDidBlurEditorText(onBlur)
            onKeyDown && editorInstance.onKeyDown(onKeyDown)
            onContextMenu && editorInstance.onContextMenu(onContextMenu)
            onModelChange && editorInstance.onDidChangeModel(onModelChange)
            onCursorPositionChange &&
                editorInstance.onDidChangeCursorPosition(onCursorPositionChange)
            onScrollChange && editorInstance.onDidScrollChange(onScrollChange)

            onChange &&
                editorInstance.onDidChangeModelContent((e) => {
                    if (programmaticSetValueRef.current) {
                        programmaticSetValueRef.current = false
                        return
                    }
                    onChange(e)
                })

            let observer: MutationObserver | undefined
            if (onSuggestionChange) {
                editorInstance.onDidFocusEditorText(() => {
                    const widgetEl = el.querySelector(".suggest-widget")
                    if (!widgetEl) return

                    observer?.disconnect()

                    let suggestionOld = noSuggestion

                    observer = new MutationObserver(() => {
                        let suggestionNew = noSuggestion

                        if (widgetEl.classList.contains("visible")) {
                            const suggestions: Array<string> = []
                            let focused = ""

                            const rows =
                                widgetEl.querySelector(".monaco-list-rows")
                            if (rows)
                                for (const item of rows.children as any) {
                                    const suggestion = item.textContent?.trim()
                                    if (suggestion) {
                                        suggestions.push(suggestion)
                                        item.classList.contains("focused") &&
                                            (focused = suggestion)
                                    }
                                }
                            suggestions.length &&
                                (suggestionNew = {
                                    suggestions,
                                    focused,
                                    show: true
                                })
                        }
                        suggestionOld !== suggestionNew &&
                            onSuggestionChange(suggestionNew)
                        suggestionOld = suggestionNew
                    })
                    observer.observe(widgetEl, { attributes: true })
                })
            }

            return () => {
                editorInstance.dispose()
                observer?.disconnect()
                currentDispose()
            }
        }, [])

        const filesRef = useRef(files)
        const [viewStateMap] = useState(
            () =>
                new Map<
                    string,
                    editor.ICodeEditorViewState | undefined | null
                >()
        )

        useEffect(() => {
            if (!files) {
                filesRef.current = files
                return
            }

            for (const key of Object.keys(filesRef.current ?? {}))
                if (!(key in files)) {
                    setTimeout(() => editor.getModel(Uri.parse(key))?.dispose())
                    viewStateMap.delete(key)
                }

            for (const [key, value] of Object.entries(files)) {
                const uri = Uri.parse(key)
                const model = editor.getModel(uri)

                if (model) continue

                const extension = splitFileName(uri.path)[1]
                const newModel = editor.createModel(
                    "",
                    languages?.[extension ?? ""] ?? language,
                    uri
                )

                if (typeof value === "string") {
                    programmaticSetValueRef.current = true
                    newModel.setValue(value)
                } else
                    value.then((s) => {
                        programmaticSetValueRef.current = true
                        newModel.setValue(s)
                    })
            }

            filesRef.current = files
        }, [files])

        const fileRef = useRef<string>()

        useEffect(() => {
            const editorInstance = currentEditor!

            fileRef.current &&
                viewStateMap.set(
                    fileRef.current,
                    editorInstance.saveViewState()
                )

            currentModel = file ? editor.getModel(Uri.parse(file)) : null
            editorInstance.setModel(currentModel)

            const viewState = file && viewStateMap.get(file)
            viewState && editorInstance.restoreViewState(viewState)

            fileRef.current = file
        }, [file])

        const [elRef, size] = useResizeObserver()
        useEffect(() => {
            currentEditor?.layout()
        }, [size])

        return (
            <div style={style} className={className} ref={elRef}>
                <div
                    style={{ width: "100%", height: "100%" }}
                    ref={editorDivRef}
                />
            </div>
        )
    }

    const decorationMap = new WeakMap<editor.ITextModel, Array<string>>()

    const setValue = (val: string) =>
        void currentEditor?.executeEdits("monaco", [
            {
                range: new Range(1, 1, Infinity, Infinity),
                text: val
            }
        ])

    const highlightLine = (line: number) => {
        if (!currentModel) return

        currentModel.deltaDecorations(decorationMap.get(currentModel) ?? [], [])
        decorationMap.set(
            currentModel,
            currentModel.deltaDecorations(
                [],
                [
                    {
                        range: new Range(line, 1, line, 1),
                        options: {
                            className: "monaco-highlight",
                            isWholeLine: true
                        }
                    }
                ]
            )
        )

        currentEditor?.revealLineInCenter(line)
    }

    const controls = {
        highlightLine,

        clearHighlight: () =>
            currentModel?.deltaDecorations(
                decorationMap.get(currentModel) ?? [],
                []
            ),

        replace: (
            lineStart: number,
            columnStart: number,
            lineEnd: number,
            columnEnd: number,
            text: string
        ) => {
            currentModel?.pushStackElement()
            currentEditor?.executeEdits("monaco", [
                {
                    range: new Range(
                        lineStart,
                        columnStart,
                        lineEnd,
                        columnEnd
                    ),
                    text
                }
            ])
        },

        insertLine: (line: number, text: string) => {
            currentModel?.pushStackElement()
            const col = currentModel?.getLineLength(line) ?? 0
            currentEditor?.executeEdits("monaco", [
                {
                    range: new Range(line, col + 1, line, col + 1),
                    text: "\n" + text,
                    forceMoveMarkers: true
                }
            ])
        },

        getEditor: () => currentEditor,

        getModel: () => currentModel,

        getValue: () => currentModel?.getValue() ?? "",

        getSelection: () => currentEditor?.getSelection(),

        setSelection: (selection: IRange) =>
            void currentEditor?.setSelection(selection),

        setScrollTop: (val: number) => currentEditor?.setScrollTop(val),

        setScrollLeft: (val: number) => currentEditor?.setScrollLeft(val),

        setValue,

        clearValue: () => setValue(""),

        getURI: () => currentModel?.uri.path ?? "",

        saveAll: () => currentSaveAll?.() || Promise.resolve(),

        save: () => {
            currentModel &&
                currentOnSave?.(currentModel.getValue(), currentModel.uri.path)
            currentEditor?.focus()
        },

        newLine: () => {
            currentEditor?.trigger(
                "monaco",
                "editor.action.insertLineAfter",
                undefined
            )
            currentEditor?.focus()
        },

        undo: () => {
            currentOnUndo?.()
            currentEditor?.trigger("monaco", "undo", undefined)
            currentEditor?.focus()
        },

        redo: () => {
            currentOnRedo?.()
            currentEditor?.trigger("monaco", "redo", undefined)
            currentEditor?.focus()
        },

        focus: () => void currentEditor?.focus(),

        suggest: () =>
            void currentEditor?.trigger(
                "monaco",
                "editor.action.triggerSuggest",
                undefined
            ),

        selectNextSuggestion: () =>
            void currentEditor?.trigger(
                "monaco",
                "selectNextSuggestion",
                undefined
            ),

        focused: () => currentFocused,

        jumpTo: (
            uri: string,
            line: number,
            fileOpen: (uri: string) => void
        ) => {
            fileOpen(uri)
            setTimeout(() => highlightLine(line))
        }
    }

    return { Monaco, controls }
}
