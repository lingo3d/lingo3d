import {
    createEffect,
    createNestedEffect,
    createRef
} from "@lincode/reactivity"
import { onSceneGraphChange } from "../../../../events/onSceneGraphChange"
import {
    emitSelectionTarget,
    onSelectionTarget
} from "../../../../events/onSelectionTarget"
import { getWorldPlayComputed } from "../../../../states/useWorldPlayComputed"
import { getMultipleSelection } from "../../../../states/useMultipleSelection"
import {
    addMultipleSelectionTargets,
    getMultipleSelectionTargets,
    deleteMultipleSelectionTargets,
    clearMultipleSelectionTargets
} from "../../../../states/useMultipleSelectionTargets"
import { setSelectionTarget } from "../../../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../../../states/useTransformControlsDragging"
import attachRaycastEvent from "./attachRaycastEvent"
import { getSelectionCandidates } from "./getSelectionCandidates"
import { getSelectionFocus } from "../../../../states/useSelectionFocus"
import { hiddenAppendables } from "../../../../collections/hiddenAppendables"
import { selectionCandidates } from "../../../../collections/selectionCandidates"
import { rightClickPtr } from "../../../../pointers/rightClickPtr"
import { onMouseClick } from "../../../../events/onMouseClick"
import { onMouseRightClick } from "../../../../events/onMouseRightClick"
import MeshAppendable from "../../../../api/core/MeshAppendable"
import { setSelectionNativeTarget } from "../../../../states/useSelectionNativeTarget"
import { selectionTargetPtr } from "../../../../pointers/selectionTargetPtr"

createEffect(() => {
    const multipleSelection = getMultipleSelection()
    const firstMultipleSelection = createRef(true)

    createNestedEffect(() => {
        !multipleSelection && (firstMultipleSelection.current = true)
    }, [multipleSelection])

    if (getWorldPlayComputed() || getTransformControlsDragging()) return

    getSelectionCandidates()
    const handle0 = onSceneGraphChange(() => getSelectionCandidates())
    const handle1 = onMouseClick(() => emitSelectionTarget(undefined))
    const handle2 = onMouseRightClick(() => emitSelectionTarget(undefined))
    const handle3 = attachRaycastEvent(
        onMouseClick,
        selectionCandidates,
        (target) => emitSelectionTarget(target),
        (native) => setSelectionNativeTarget(native)
    )
    const handle4 = attachRaycastEvent(
        onMouseRightClick,
        selectionCandidates,
        (target) => emitSelectionTarget(target),
        (native) => setSelectionNativeTarget(native)
    )
    const handle5 = onSelectionTarget(({ target, noDeselect }) => {
        if (multipleSelection) {
            if (!(target instanceof MeshAppendable) || rightClickPtr[0]) return

            if (firstMultipleSelection.current) {
                const [currentTarget] = selectionTargetPtr
                currentTarget instanceof MeshAppendable &&
                    !hiddenAppendables.has(currentTarget) &&
                    addMultipleSelectionTargets(currentTarget)
            }
            firstMultipleSelection.current = false

            if (getMultipleSelectionTargets()[0].has(target))
                deleteMultipleSelectionTargets(target)
            else if (!hiddenAppendables.has(target))
                addMultipleSelectionTargets(target)

            return
        }
        if (rightClickPtr[0] && getMultipleSelectionTargets()[0].size) return

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
    getWorldPlayComputed,
    getTransformControlsDragging,
    getMultipleSelection,
    getSelectionFocus
])
