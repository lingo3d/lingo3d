import { createEffect } from "@lincode/reactivity"
import openFolder from "../../api/files/openFolder"
import saveJSON from "../../api/files/saveJSON"
import deleteSelected from "./deleteSelected"
import { emitEditorCenterView } from "../../events/onEditorCenterView"
import { onKeyClear } from "../../events/onKeyClear"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { setEditorCamera } from "../../states/useEditorCamera"
import { setMultipleSelection } from "../../states/useMultipleSelection"
import mainCamera from "../mainCamera"
import copySelected from "./copySelected"
import { setTransformControlsSnap } from "../../states/useTransformControlsSnap"
import { getUILayer, setUILayer } from "../../states/useUILayer"
import {
    getHotKeysEnabled,
    setHotKeysEnabled
} from "../../states/useHotKeysEnabled"
import settings from "../../api/settings"
import { container } from "../renderLoop/containers"
import MeshAppendable from "../../display/core/MeshAppendable"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { redo, undo } from "../../api/undoStack"
import { getWorldMode } from "../../states/useWorldMode"
import { worldModePtr } from "../../pointers/worldModePtr"

const enabledSet = new Set<HTMLElement>()
export const enableHotKeysOnElement = (el: HTMLElement) => {
    el.addEventListener("mouseover", () => enabledSet.add(el))
    el.addEventListener("mouseout", () => enabledSet.delete(el))
    el.addEventListener("drop", () => setHotKeysEnabled(true))
}
enableHotKeysOnElement(container)

export const handleStopPropagation = (e: Event) => {
    e.stopPropagation()
    setHotKeysEnabled(!!enabledSet.size)
}
document.addEventListener("mousedown", () =>
    setHotKeysEnabled(!!enabledSet.size)
)

const metaHotKey = (e: KeyboardEvent) => {
    e.preventDefault()
    setMultipleSelection(false)
}

createEffect(() => {
    if (worldModePtr[0] !== "editor" || !getHotKeysEnabled()) return

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Shift" || e.key === "Meta" || e.key === "Control")
            setMultipleSelection(true)
        if (e.key === "Shift") setTransformControlsSnap(true)

        if (e.key === "Backspace" || e.key === "Delete") {
            e.preventDefault()
            deleteSelected()
            return
        }

        const keyLowerCase = e.key.toLocaleLowerCase()
        if (keyLowerCase === "g") {
            settings.grid = !settings.grid
            return
        }
        if (keyLowerCase === "u") {
            setUILayer(!getUILayer())
            return
        }

        const [target] = selectionTargetPtr

        if (e.metaKey || e.ctrlKey) {
            if (keyLowerCase === "z") {
                metaHotKey(e)
                if (e.shiftKey) redo()
                else undo()
            }
            if (keyLowerCase === "y") {
                metaHotKey(e)
                redo()
            }
            if (keyLowerCase === "s") {
                metaHotKey(e)
                saveJSON()
            } else if (keyLowerCase === "o") {
                metaHotKey(e)
                openFolder()
            } else if (keyLowerCase === "c") {
                metaHotKey(e)
                copySelected()
            } else if (keyLowerCase === "p") metaHotKey(e)
        } else if (keyLowerCase === "c") {
            setEditorCamera(mainCamera)
            setUILayer(false)
            target instanceof MeshAppendable && emitEditorCenterView(target)
        } else if (keyLowerCase === "escape")
            target && emitSelectionTarget(undefined)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === "Shift" || e.key === "Meta" || e.key === "Control")
            setMultipleSelection(false)
        if (e.key === "Shift") setTransformControlsSnap(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
    const handle = onKeyClear(() => setMultipleSelection(false))

    return () => {
        document.removeEventListener("keydown", handleKeyDown)
        document.removeEventListener("keyup", handleKeyUp)
        handle.cancel()
    }
}, [getWorldMode, getHotKeysEnabled])
