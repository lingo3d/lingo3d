import store, { add, createEffect, remove, clear } from "@lincode/reactivity"
import { onDispose } from "../events/onDispose"
import { Object3D } from "three"
import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { box3, vector3 } from "../display/utils/reusables"
import { onEditorGroupItems } from "../events/onEditorGroupItems"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import { setSelectionTarget } from "./useSelectionTarget"
import MeshAppendable from "../api/core/MeshAppendable"
import { Queue } from "@lincode/promiselikes"
import { multipleSelectionTargets } from "../collections/multipleSelectionTargets"

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

    const groupManager = new SimpleObjectManager()
    groupManager.$ghost()
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

    let consolidated = false
    const handle = onEditorGroupItems(() => {
        if (!multipleSelectionTargets.size || consolidated) return
        consolidated = true

        import("../display/Group").then(({ default: Group }) => {
            if (handle.done) return
            const consolidatedGroup = new Group()
            consolidatedGroup.position.copy(group.position)
            for (const target of multipleSelectionTargets)
                consolidatedGroup.attach(target)
            emitSelectionTarget(consolidatedGroup)
        })
    })

    return () => {
        if (!groupManager.done && !consolidated)
            for (const [object, parent] of parentEntries) parent.attach(object)

        groupManager.dispose()
        handle.cancel()
    }
}, [getMultipleSelectionTargets])

createEffect(() => {
    if (!multipleSelectionTargets.size) return

    const handle = onDispose(
        (item) =>
            item instanceof MeshAppendable &&
            multipleSelectionTargets.has(item) &&
            deleteMultipleSelectionTargets(item)
    )
    return () => {
        handle.cancel()
    }
}, [getMultipleSelectionTargets])
