import store, { add, createEffect, remove, clear } from "@lincode/reactivity"
import { Object3D } from "three"
import { box3, vector3 } from "../display/utils/reusables"
import { setSelectionTarget } from "./useSelectionTarget"
import MeshAppendable from "../api/core/MeshAppendable"
import { Queue } from "@lincode/promiselikes"
import { multipleSelectionTargets } from "../collections/multipleSelectionTargets"
import {
    addDisposeCollectionStateSystem,
    deleteDisposeCollectionStateSystem
} from "../systems/eventSystems/disposeCollectionStateSystem"
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

const queue = new Queue()
export const flushMultipleSelectionTargets = async (
    onFlush: (targets: Array<MeshAppendable>) => Array<MeshAppendable> | void,
    deselect?: boolean
) => {
    await queue

    const targetsBackup = [...multipleSelectionTargets]
    multipleSelectionTargets.clear()
    setMultipleSelectionTargets([multipleSelectionTargets])

    await Promise.resolve()

    const newTargets = onFlush(targetsBackup)
    if (deselect) {
        queue.resolve()
        return
    }
    await Promise.resolve()
    await Promise.resolve()

    for (const target of newTargets ?? targetsBackup)
        multipleSelectionTargets.add(target)
    setMultipleSelectionTargets([multipleSelectionTargets])
    queue.resolve()
}

createEffect(() => {
    if (!multipleSelectionTargets.size) return

    const groupManager = new MeshAppendable()
    groupManager.$ghost()
    multipleSelectionGroupPtr[0] = groupManager
    const group = groupManager.object3d
    setSelectionTarget(groupManager)

    const parentEntries: Array<[Object3D, Object3D]> = []
    for (const { outerObject3d } of multipleSelectionTargets) {
        if (!outerObject3d.parent) continue
        parentEntries.push([outerObject3d, outerObject3d.parent])
        group.attach(outerObject3d)
    }

    box3.setFromObject(group)
    for (const [object, parent] of parentEntries) parent.attach(object)

    group.position.copy(box3.getCenter(vector3))
    for (const [object] of parentEntries) group.attach(object)

    return () => {
        if (parentEntries[0][0].parent === group)
            for (const [object, parent] of parentEntries) parent.attach(object)

        groupManager.dispose()
        multipleSelectionGroupPtr[0] = undefined
    }
}, [getMultipleSelectionTargets])

createEffect(() => {
    if (!multipleSelectionTargets.size) return
    addDisposeCollectionStateSystem(multipleSelectionTargets, {
        deleteState: deleteMultipleSelectionTargets
    })
    return () => {
        deleteDisposeCollectionStateSystem(multipleSelectionTargets)
    }
}, [getMultipleSelectionTargets])
