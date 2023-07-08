import store, { add, createEffect, remove, clear } from "@lincode/reactivity"
import { Object3D } from "three"
import { box3, vector3 } from "../display/utils/reusables"
import { setSelectionTarget } from "./useSelectionTarget"
import MeshAppendable from "../display/core/MeshAppendable"
import { multipleSelectionTargets } from "../collections/multipleSelectionTargets"
import { disposeCollectionStateSystem } from "../systems/eventSystems/disposeCollectionStateSystem"
import { multipleSelectionGroupPtr } from "../pointers/multipleSelectionGroupPtr"

const [setMultipleSelectionTargets, getMultipleSelectionTargets] = store([
    multipleSelectionTargets
])
export { getMultipleSelectionTargets }
export const addMultipleSelectionTargets = add(
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
)
export const deleteMultipleSelectionTargets = remove(
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
)
export const clearMultipleSelectionTargets = clear(
    setMultipleSelectionTargets,
    getMultipleSelectionTargets
)

let parentEntries: Array<[Object3D, Object3D]> | undefined
let group: Object3D | undefined
let attached = false
const detach = () => {
    if (!parentEntries || !attached) return
    attached = false
    if (parentEntries[0][0].parent === group)
        for (const [object, parent] of parentEntries) parent.attach(object)
}
const attach = () => {
    if (!parentEntries || !group || attached) return
    attached = true
    for (const [object] of parentEntries) group.attach(object)
}

export const flushMultipleSelectionTargets = (
    onFlush: () => Array<MeshAppendable> | void,
    deselect?: boolean
) => {
    detach()
    const newTargets = onFlush()
    if (newTargets) {
        multipleSelectionTargets.clear()
        for (const target of newTargets) multipleSelectionTargets.add(target)
        setMultipleSelectionTargets([multipleSelectionTargets])
        return
    }
    if (deselect) {
        multipleSelectionTargets.clear()
        setMultipleSelectionTargets([multipleSelectionTargets])
        return
    }
    attach()
}

createEffect(() => {
    if (!multipleSelectionTargets.size) return

    const groupManager = new MeshAppendable()
    groupManager.$ghost()
    multipleSelectionGroupPtr[0] = groupManager
    setSelectionTarget(groupManager)

    parentEntries = []
    group = groupManager.$innerObject
    attached = true

    for (const { $object } of multipleSelectionTargets) {
        if (!$object.parent) continue
        parentEntries.push([$object, $object.parent])
        group.attach($object)
    }

    box3.setFromObject(group)
    for (const [object, parent] of parentEntries) parent.attach(object)

    group.position.copy(box3.getCenter(vector3))
    for (const [object] of parentEntries) group.attach(object)

    return () => {
        detach()
        groupManager.dispose()
        multipleSelectionGroupPtr[0] = undefined
        parentEntries = undefined
        group = undefined
    }
}, [getMultipleSelectionTargets])

createEffect(() => {
    if (!multipleSelectionTargets.size) return
    disposeCollectionStateSystem.add(multipleSelectionTargets, {
        deleteState: deleteMultipleSelectionTargets
    })
    return () => {
        disposeCollectionStateSystem.delete(multipleSelectionTargets)
    }
}, [getMultipleSelectionTargets])
