import { last, omit, preventTreeShake } from "@lincode/utils"
import { FolderApi, Pane } from "tweakpane"
import settings from "../../api/settings"
import mainCamera from "../../engine/mainCamera"
import { setGridHelper } from "../../states/useGridHelper"
import { setOrbitControls } from "../../states/useOrbitControls"
import { setSelection } from "../../states/useSelection"
import { setSelectionBlockKeyboard } from "../../states/useSelectionBlockKeyboard"
import { setSelectionBlockMouse } from "../../states/useSelectionBlockMouse"
import { h } from "preact"
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks"
import register from "preact-custom-element"
import {
    useSelectionTarget,
    useCameraList,
    useMultipleSelectionTargets,
    useCameraStack,
    useDefaultLight,
    useDefaultFog,
    useNodeEditor
} from "../states"
import { Cancellable } from "@lincode/promiselikes"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import {
    getSecondaryCamera,
    setSecondaryCamera
} from "../../states/useSecondaryCamera"
import deserialize from "../../api/serializer/deserialize"
import serialize from "../../api/serializer/serialize"
import { emitEditorCenterView } from "../../events/onEditorCenterView"
import {
    getMultipleSelection,
    setMultipleSelection
} from "../../states/useMultipleSelection"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { onKeyClear } from "../../events/onKeyClear"
import { nonEditorSettings } from "../../api/serializer/types"
import { onApplySetup } from "../../events/onApplySetup"
import ISetup, { setupDefaults } from "../../interface/ISetup"
import { isPositionedItem } from "../../api/core/PositionedItem"
import { emitEditorMountChange } from "../../events/onEditorMountChange"
import mainOrbitCamera from "../../engine/mainOrbitCamera"
import getComponentName from "../utils/getComponentName"
import createElement from "../../utils/createElement"
import { onTransformControls } from "../../events/onTransformControls"
import { emitSceneGraphNameChange } from "../../events/onSceneGraphNameChange"
import useInit from "../utils/useInit"

preventTreeShake(h)

const Editor = () => {
    const elRef = useInit()

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        const pane = new Pane({ container: el })

        return () => {
            pane.dispose()
        }
    }, [
    ])

    return (
        <div
            ref={elRef}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            className="lingo3d-ui"
            style={{
                width: 300,
                height: "100%",
                background: "rgb(40, 41, 46)"
            }}
        />
    )
}

const EditorParent = () => {
    const [nodeEditor] = useNodeEditor()

    if (nodeEditor) return null

    return (
        <Editor />
    )
}
export default EditorParent

register(EditorParent, "lingo3d-editor", ["mouse", "keyboard"])
