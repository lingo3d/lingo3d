import {
    createEffect,
    createNestedEffect,
    createRef
} from "@lincode/reactivity"
import { hiddenAppendables } from "../../../../api/core/collections"
import { isPositionedManager } from "../../PositionedManager"
import { mouseEvents } from "../../../../api/mouse"
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
import {
    getSelectionTarget,
    setSelectionTarget
} from "../../../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../../../states/useTransformControlsDragging"
import pickable from "./pickable"
import selectionCandidates, {
    getSelectionCandidates
} from "./selectionCandidates"
import { getSelectionFocus } from "../../../../states/useSelectionFocus"

createEffect(() => {
    const multipleSelection = getMultipleSelection()
    const firstMultipleSelection = createRef(true)

    createNestedEffect(() => {
        !multipleSelection && (firstMultipleSelection.current = true)
    }, [multipleSelection])

    if (getWorldPlayComputed() || getTransformControlsDragging()) return

    getSelectionCandidates()
    const handle0 = onSceneGraphChange(() => getSelectionCandidates())
    const handle1 = mouseEvents.on("click", () =>
        emitSelectionTarget(undefined)
    )
    const handleBlankSpaceRightClick = mouseEvents.on("rightClick", () =>
        emitSelectionTarget(undefined, true)
    )
    const handle2 = pickable(["rightClick"], selectionCandidates, (target) =>
        emitSelectionTarget(target, true)
    )
    const handle3 = pickable(["click"], selectionCandidates, (target) =>
        emitSelectionTarget(target)
    )
    const handle4 = onSelectionTarget(({ target, rightClick, noDeselect }) => {
        if (multipleSelection) {
            if (!isPositionedManager(target) || rightClick) return

            if (firstMultipleSelection.current) {
                const currentTarget = getSelectionTarget()
                isPositionedManager(currentTarget) &&
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
        if (rightClick && getMultipleSelectionTargets()[0].size) return

        clearMultipleSelectionTargets()
        setSelectionTarget(
            rightClick || noDeselect
                ? target
                : target === getSelectionTarget()
                ? undefined
                : target
        )
    })
    return () => {
        handle0.cancel()
        handle1.cancel()
        handleBlankSpaceRightClick.cancel()
        handle2.cancel()
        handle3.cancel()
        handle4.cancel()
    }
}, [
    getWorldPlayComputed,
    getTransformControlsDragging,
    getMultipleSelection,
    getSelectionFocus
])
