import { createEffect } from "@lincode/reactivity"
import openFolder from "../api/files/openFolder"
import saveJSON from "../api/files/saveJSON"
import deserialize from "../api/serializer/deserialize"
import serialize from "../api/serializer/serialize"
import settings from "../api/settings"
import { redo, undo } from "../api/undoStack"
import { isPositionedManager } from "../display/core/PositionedManager"
import deleteSelected from "../editor/Editor/deleteSelected"
import { emitEditorCenterView } from "../events/onEditorCenterView"
import { onKeyClear } from "../events/onKeyClear"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import { setEditorCamera, getEditorCamera } from "../states/useEditorCamera"
import {
    setMultipleSelection,
    getMultipleSelection
} from "../states/useMultipleSelection"
import {
    flushMultipleSelectionTargets,
    getMultipleSelectionTargets
} from "../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { getSplitView, setSplitView } from "../states/useSplitView"
import { getWorldPlayComputed } from "../states/useWorldPlayComputed"
import mainCamera from "./mainCamera"

createEffect(() => {
    if (getWorldPlayComputed()) return

    const handleKeyDown = async (e: KeyboardEvent) => {
        if (e.key === "Shift" || e.key === "Meta" || e.key === "Control")
            setMultipleSelection(true)

        if (e.key === "Backspace" || e.key === "Delete") {
            e.preventDefault()
            !getMultipleSelection() && deleteSelected()
            return
        }

        const keyLowerCase = e.key.toLocaleLowerCase()
        if (keyLowerCase === "g") {
            settings.gridHelper = !settings.gridHelper
            return
        }

        if (keyLowerCase === "1") {
            if (!getSplitView()) {
                setEditorCamera(
                    getEditorCamera() === mainCamera ? undefined : mainCamera
                )
            }
            setSplitView(false)
            return
        }
        if (keyLowerCase === "2") {
            setSplitView(true)
            setEditorCamera(undefined)
            return
        }
        if (keyLowerCase === "3") {
            settings.uiLayer = !settings.uiLayer
            return
        }

        const target = getSelectionTarget()

        if (e.metaKey || e.ctrlKey) {
            if (keyLowerCase === "z") {
                e.preventDefault()
                if (e.shiftKey) redo()
                else undo()
            }
            if (keyLowerCase === "y") {
                e.preventDefault()
                redo()
            }
            if (keyLowerCase === "s") {
                e.preventDefault()
                saveJSON()
            } else if (keyLowerCase === "o") {
                e.preventDefault()
                openFolder()
            } else if (target) {
                if (keyLowerCase === "c") {
                    e.preventDefault()
                    const targets = getMultipleSelectionTargets()
                    if (targets.length) {
                        flushMultipleSelectionTargets(() => {
                            //mark
                        })
                    } else {
                        const [item] = deserialize(
                            await serialize(false, target, true)
                        )
                        if (target.parent && item) {
                            "attach" in target.parent
                                ? target.parent.attach(item)
                                : target.parent.append(item)
                            emitSelectionTarget(item)
                        }
                    }
                }
            }
        } else if (keyLowerCase === "c") {
            setEditorCamera(mainCamera)
            settings.uiLayer = false
            isPositionedManager(target) && emitEditorCenterView(target)
        } else if (keyLowerCase === "escape")
            target && emitSelectionTarget(undefined)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === "Shift" || e.key === "Meta" || e.key === "Control")
            setMultipleSelection(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
    const handle = onKeyClear(() => setMultipleSelection(false))

    return () => {
        document.removeEventListener("keydown", handleKeyDown)
        document.removeEventListener("keyup", handleKeyUp)
        handle.cancel()
    }
}, [getWorldPlayComputed])
