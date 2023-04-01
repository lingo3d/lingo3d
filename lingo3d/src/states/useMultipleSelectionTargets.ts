import store, { add, createEffect, remove, clear } from "@lincode/reactivity"
import PositionedManager, {
    isPositionedManager
} from "../display/core/PositionedManager"
import { onDispose } from "../events/onDispose"
import { Object3D } from "three"
import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { box3, vector3 } from "../display/utils/reusables"
import scene from "../engine/scene"
import { onEditorGroupItems } from "../events/onEditorGroupItems"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import { setSelectionTarget } from "./useSelectionTarget"
import { eraseAppendable } from "../display/utils/eraseAppendable"

const [setMultipleSelectionTargets, getMultipleSelectionTargets] = store([
    new Set<PositionedManager>()
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

export const multipleSelectionTargetsFlushingPtr = [false]

export const flushMultipleSelectionTargets = async (
    onFlush: (
        targets: Array<PositionedManager>
    ) => Array<PositionedManager> | void,
    deselect?: boolean
) => {
    multipleSelectionTargetsFlushingPtr[0] = true

    const [targets] = getMultipleSelectionTargets()
    const targetsBackup = [...targets]
    targets.clear()
    setMultipleSelectionTargets([targets])

    await Promise.resolve()

    const newTargets = onFlush(targetsBackup)
    if (deselect) {
        multipleSelectionTargetsFlushingPtr[0] = false
        return
    }
    await Promise.resolve()
    await Promise.resolve()

    for (const target of newTargets ?? targetsBackup) targets.add(target)
    setMultipleSelectionTargets([targets])
    multipleSelectionTargetsFlushingPtr[0] = false
}

createEffect(() => {
    const [targets] = getMultipleSelectionTargets()
    if (!targets.size) return

    const group = new Object3D()
    scene.add(group)

    const groupManager = new SimpleObjectManager(group)
    eraseAppendable(groupManager)
    setSelectionTarget(groupManager)

    const parentEntries: Array<[Object3D, Object3D]> = []
    for (const { outerObject3d } of targets) {
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
        if (!targets.size || consolidated) return
        consolidated = true

        import("../display/Group").then(({ default: Group }) => {
            if (handle.done) return
            const consolidatedGroup = new Group()
            consolidatedGroup.position.copy(group.position)
            for (const target of targets) consolidatedGroup.attach(target)
            emitSelectionTarget(consolidatedGroup)
        })
    })

    return () => {
        if (!groupManager.done && !consolidated)
            for (const [object, parent] of parentEntries) parent.attach(object)

        groupManager.dispose()
        scene.remove(group)
        handle.cancel()
    }
}, [getMultipleSelectionTargets])

createEffect(() => {
    const [targets] = getMultipleSelectionTargets()
    if (!targets.size) return

    const handle = onDispose(
        (item) =>
            isPositionedManager(item) &&
            targets.has(item) &&
            deleteMultipleSelectionTargets(item)
    )
    return () => {
        handle.cancel()
    }
}, [getMultipleSelectionTargets])
