import store, { add, remove, clear, createEffect } from "@lincode/reactivity"
import { appendableRoot } from "../collections/appendableRoot"
import Appendable from "../display/core/Appendable"
import VisibleMixin from "../display/core/mixins/VisibleMixin"
import { onId } from "../events/onId"
import { selectionCandidates } from "../collections/selectionCandidates"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import { getSelectionCandidates } from "../throttle/getSelectionCandidates"

const [setSelectionHideId, getSelectionHideId] = store([new Set<string>()])
export { getSelectionHideId }
export const addSelectionHideId = add(setSelectionHideId, getSelectionHideId)
export const removeSelectionHideId = remove(
    setSelectionHideId,
    getSelectionHideId
)
export const clearSelectionHideId = clear(
    setSelectionHideId,
    getSelectionHideId
)

createEffect(() => {
    const [hideIdSet] = getSelectionHideId()
    if (!hideIdSet.size) return

    const hidden: Array<VisibleMixin> = []
    for (const manager of appendableRoot)
        manager.traverse((child: Appendable | VisibleMixin) => {
            if ("visible" in child && child.id && hideIdSet.has(child.id)) {
                hidden.push(child)
                child.visible = false
                child.$disableSelection = true
                selectionCandidates.delete(child.$innerObject)
            }
        })
    emitSelectionTarget(undefined)

    const handle = onId((child: Appendable | VisibleMixin) => {
        if ("visible" in child && child.id && hideIdSet.has(child.id)) {
            hidden.push(child)
            child.visible = false
            child.$disableSelection = true
            selectionCandidates.delete(child.$innerObject)
            emitSelectionTarget(undefined)
        }
    })
    return () => {
        handle.cancel()
        for (const child of hidden) {
            child.visible = true
            child.$disableSelection = false
        }
        getSelectionCandidates()
    }
}, [getSelectionHideId])
