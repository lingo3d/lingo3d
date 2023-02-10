import { Pane } from "./tweakpane"
import { useLayoutEffect } from "preact/hooks"
import { Cancellable } from "@lincode/promiselikes"
import getDisplayName from "../utils/getDisplayName"
import { dummyDefaults } from "../../interface/IDummy"
import Setup from "../../display/Setup"
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

    const selectionTarget = useSyncState(getSelectionTarget)
    const selectedSignal = useSignal<string | undefined>(undefined)

    const presets = useSyncState(getEditorPresets)

    useLayoutEffect(() => {
        const el = elRef.current
        if (!el) return

        const pane = new Pane({ container: el })

        const handle = new Cancellable()
        if (
            selectedSignal.value === "Settings" ||
            !selectionTarget ||
            selectionTarget instanceof Setup
        ) {
            addSetupInputs(handle, pane, setupStruct)
            return () => {
                handle.cancel()
                pane.dispose()
            }
        }
        if (!getMultipleSelectionTargets()[0].size)
            addTargetInputs(handle, pane, selectionTarget)

        return () => {
            handle.cancel()
            pane.dispose()
        }
    }, [selectionTarget, selectedSignal.value, presets])

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
            <div
                style={{
                    flexGrow: 1,
                    overflowY: "scroll",
                    overflowX: "hidden",
                    paddingLeft: 8,
                    paddingRight: 8
                }}
                ref={elRef}
            />
        </div>
    )
}
export default Editor
