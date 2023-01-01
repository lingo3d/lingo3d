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
    pushMultipleSelectionTargets,
    getMultipleSelectionTargets,
    pullMultipleSelectionTargets,
    resetMultipleSelectionTargets
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

createEffect(() => {
    if (getWorldPlayComputed() || getTransformControlsDragging()) return

    getSelectionCandidates()
    const handle0 = onSceneGraphChange(() => getSelectionCandidates())
    const handle1 = mouseEvents.on("click", () =>
        emitSelectionTarget(undefined)
    )
    const handle3 = pickable(["click"], selectionCandidates, (target) => {
        emitSelectionTarget(target)
    })
    const handle4 = onSelectionTarget(({ target }) => {
        setSelectionTarget(target)
    })
    return () => {
        handle0.cancel()
        handle1.cancel()
        handle3.cancel()
        handle4.cancel()
    }
}, [getWorldPlayComputed, getTransformControlsDragging, getMultipleSelection])
