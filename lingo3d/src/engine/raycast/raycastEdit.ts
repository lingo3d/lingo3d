import {
    createEffect,
    createNestedEffect,
    createRef
} from "@lincode/reactivity"
import { onSceneGraphChange } from "../../events/onSceneGraphChange"
import {
    emitSelectionTarget,
    onSelectionTarget
} from "../../events/onSelectionTarget"
import { getMultipleSelection } from "../../states/useMultipleSelection"
import {
    addMultipleSelectionTargets,
    deleteMultipleSelectionTargets,
    clearMultipleSelectionTargets
} from "../../states/useMultipleSelectionTargets"
import { setSelectionTarget } from "../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import attachRaycastEvent from "./attachRaycastEvent"
import { getSelectionFocus } from "../../states/useSelectionFocus"
import { selectionCandidates } from "../../collections/selectionCandidates"
import { rightClickPtr } from "../../pointers/rightClickPtr"
import { onMouseClick } from "../../events/onMouseClick"
import { onMouseRightClick } from "../../events/onMouseRightClick"
import MeshAppendable from "../../display/core/MeshAppendable"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { getSelectionCandidates } from "../../throttle/getSelectionCandidates"
import { multipleSelectionTargets } from "../../collections/multipleSelectionTargets"
import { getWorldMode } from "../../states/useWorldMode"
import { worldModePtr } from "../../pointers/worldModePtr"

createEffect(() => {
    const multipleSelection = getMultipleSelection()
    const firstMultipleSelection = createRef(true)

    createNestedEffect(() => {
        !multipleSelection && (firstMultipleSelection.current = true)
    }, [multipleSelection])

    if (worldModePtr[0] !== "editor" || getTransformControlsDragging()) return

    getSelectionCandidates()
    const handle0 = onSceneGraphChange(() => getSelectionCandidates())
    const handle1 = onMouseClick(() => emitSelectionTarget(undefined))
    const handle2 = onMouseRightClick(() => emitSelectionTarget(undefined))
    const handle3 = attachRaycastEvent(
        onMouseClick,
        selectionCandidates,
        (target) => emitSelectionTarget(target)
    )
    const handle4 = attachRaycastEvent(
        onMouseRightClick,
        selectionCandidates,
        (target) => emitSelectionTarget(target)
    )
    const handle5 = onSelectionTarget(({ target, noDeselect }) => {
        if (multipleSelection) {
            if (!(target instanceof MeshAppendable) || rightClickPtr[0]) return

            if (firstMultipleSelection.current) {
                const [currentTarget] = selectionTargetPtr
                currentTarget instanceof MeshAppendable &&
                    !currentTarget.$disableSceneGraph &&
                    addMultipleSelectionTargets(currentTarget)
            }
            firstMultipleSelection.current = false

            if (multipleSelectionTargets.has(target))
                deleteMultipleSelectionTargets(target)
            else if (!target.$disableSceneGraph)
                addMultipleSelectionTargets(target)

            return
        }
        if (rightClickPtr[0] && multipleSelectionTargets.size) return

        clearMultipleSelectionTargets()
        setSelectionTarget(
            rightClickPtr[0] || noDeselect
                ? target
                : target === selectionTargetPtr[0]
                ? undefined
                : target
        )
    })
    return () => {
        handle0.cancel()
        handle1.cancel()
        handle2.cancel()
        handle3.cancel()
        handle4.cancel()
        handle5.cancel()
    }
}, [
    getWorldMode,
    getTransformControlsDragging,
    getMultipleSelection,
    getSelectionFocus
])
