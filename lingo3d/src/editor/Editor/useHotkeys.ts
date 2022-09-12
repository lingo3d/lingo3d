import { useEffect } from "preact/hooks"
import { isPositionedItem } from "../../api/core/PositionedItem"
import openFolder from "../../api/files/openFolder"
import saveJSON from "../../api/files/saveJSON"
import deserialize from "../../api/serializer/deserialize"
import serialize from "../../api/serializer/serialize"
import settings from "../../api/settings"
import applyCentripetalQuaternion from "../../display/utils/applyCentripetalQuaternion"
import { emitEditorCenterView } from "../../events/onEditorCenterView"
import { onKeyClear } from "../../events/onKeyClear"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { getCentripetal } from "../../states/useCentripetal"
import {
    setMultipleSelection,
    getMultipleSelection
} from "../../states/useMultipleSelection"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { setTransformControlsSpace } from "../../states/useTransformControlsSpace"
import deleteSelected from "./deleteSelected"

export default () => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
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

            const target = getSelectionTarget()

            if (e.metaKey || e.ctrlKey) {
                e.preventDefault()

                if (keyLowerCase === "s") saveJSON()
                else if (keyLowerCase === "o") openFolder()
                else if (target) {
                    if (keyLowerCase === "c") {
                        const targets = getMultipleSelectionTargets()
                        if (targets.length) {
                            //todo: copy multiple
                        } else {
                            const [item] = deserialize(serialize(target))
                            if (target.parent && item) {
                                target.parent.attach(item)
                                emitSelectionTarget(item)
                            }
                        }
                    } else if (e.key === "ArrowUp" && getCentripetal()) {
                        applyCentripetalQuaternion(target)
                        setTransformControlsSpace("local")
                    }
                }
            } else if (keyLowerCase === "c")
                isPositionedItem(target) && emitEditorCenterView(target)
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
