import { useEffect } from "preact/hooks"
import { isPositionedItem } from "../../api/core/PositionedItem"
import openFolder from "../../api/files/openFolder"
import saveJSON from "../../api/files/saveJSON"
import deserialize from "../../api/serializer/deserialize"
import serialize from "../../api/serializer/serialize"
import settings from "../../api/settings"
import applyCentripetalQuaternion from "../../display/utils/applyCentripetalQuaternion"
import mainCamera from "../../engine/mainCamera"
import { emitEditorCenterView } from "../../events/onEditorCenterView"
import { onKeyClear } from "../../events/onKeyClear"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { getCentripetal } from "../../states/useCentripetal"
import { getEditorCamera, setEditorCamera } from "../../states/useEditorCamera"
import { redo, undo } from "../../api/undoStack"
import {
    setMultipleSelection,
    getMultipleSelection
} from "../../states/useMultipleSelection"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getSplitView, setSplitView } from "../../states/useSplitView"
import { setTransformControlsSpace } from "../../states/useTransformControlsSpace"
import deleteSelected from "./deleteSelected"

export default () => {
    useEffect(() => {
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
                        getEditorCamera() === mainCamera
                            ? undefined
                            : mainCamera
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
                            //todo: copy multiple
                        } else {
                            const [item] = deserialize(
                                await serialize(false, target, true)
                            )
                            if (target.parent && item) {
                                target.parent.attach(item)
                                emitSelectionTarget(item)
                            }
                        }
                    } else if (e.key === "ArrowUp" && getCentripetal()) {
                        e.preventDefault()
                        applyCentripetalQuaternion(target)
                        setTransformControlsSpace("local")
                    }
                }
            } else if (keyLowerCase === "c") {
                setEditorCamera(mainCamera)
                settings.uiLayer = false
                isPositionedItem(target) && emitEditorCenterView(target)
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
    }, [])
}
