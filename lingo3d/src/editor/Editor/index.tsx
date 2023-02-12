import { useLayoutEffect, useState } from "preact/hooks"
import { Cancellable } from "@lincode/promiselikes"
import getDisplayName from "../utils/getDisplayName"
import { dummyDefaults } from "../../interface/IDummy"
import Setup, { defaultSetup } from "../../display/Setup"
import addSetupInputs from "./addSetupInputs"
import CloseableTab from "../component/tabs/CloseableTab"
import AppBar from "../component/bars/AppBar"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import useInitCSS from "../hooks/useInitCSS"
import useClickable from "../hooks/useClickable"
import { useSignal } from "@preact/signals"
import useSyncState from "../hooks/useSyncState"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { DEBUG, EDITOR_WIDTH } from "../../globals"
import useInitEditor from "../hooks/useInitEditor"
import setupStruct from "../../engine/setupStruct"
import { getEditorPresets } from "../../states/useEditorPresets"
import addTargetInputs from "./addTargetInputs"
import SearchBox from "../component/SearchBox"
import unsafeGetValue from "../../utils/unsafeGetValue"
import usePane from "./usePane"
import mergeRefs from "../hooks/mergeRefs"

Object.assign(dummyDefaults, {
    stride: { x: 0, y: 0 }
})

const Editor = () => {
    useInitCSS()
    useInitEditor()

    useLayoutEffect(() => {
        if (!DEBUG) {
            window.onbeforeunload = confirmExit
            function confirmExit() {
                return "Are you sure you want to close the current page?"
            }
        }
    }, [])

    const elRef = useClickable()
    const [pane, setContainer] = usePane()

    const selectionTarget = useSyncState(getSelectionTarget)
    const selectedSignal = useSignal<string | undefined>(undefined)

    const presets = useSyncState(getEditorPresets)
    const [includeKeys, setIncludeKeys] = useState<Array<string>>()

    useLayoutEffect(() => {
        if (!pane || getMultipleSelectionTargets()[0].size) return
        if (
            selectedSignal.value === "Settings" ||
            !selectionTarget ||
            selectionTarget instanceof Setup
        ) {
            const handle = addSetupInputs(pane, setupStruct, includeKeys)
            return () => {
                handle.cancel()
            }
        }
        const handle = addTargetInputs(pane, selectionTarget, includeKeys)
        return () => {
            handle.cancel()
        }
    }, [selectionTarget, selectedSignal.value, presets, includeKeys, pane])

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-editor lingo3d-flexcol"
            style={{ width: EDITOR_WIDTH, height: "100%" }}
        >
            <AppBar selectedSignal={selectedSignal}>
                <CloseableTab>Settings</CloseableTab>
                {selectionTarget && (
                    <CloseableTab
                        key={selectionTarget.uuid}
                        selected
                        onClose={() => emitSelectionTarget(undefined)}
                    >
                        {getDisplayName(selectionTarget)}
                    </CloseableTab>
                )}
            </AppBar>
            <SearchBox
                onChange={(val) => {
                    if (!val) {
                        setIncludeKeys(undefined)
                        return
                    }
                    val = val.toLowerCase()
                    setIncludeKeys(
                        Object.keys(
                            unsafeGetValue(
                                selectionTarget ?? defaultSetup,
                                "constructor"
                            ).schema
                        ).filter((key) => key.toLowerCase().includes(val))
                    )
                }}
            />
            <div
                style={{
                    flexGrow: 1,
                    overflowY: "scroll",
                    overflowX: "hidden",
                    paddingLeft: 8,
                    paddingRight: 8
                }}
                ref={mergeRefs(elRef, setContainer)}
            />
        </div>
    )
}
export default Editor
