import store, { createEffect, pull, push, reset } from "@lincode/reactivity"
import { Group, Object3D } from "three"
import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { box3, vector3 } from "../display/utils/reusables"
import scene from "../engine/scene"
import { getMultipleSelectionEnabled } from "./useMultipleSelectionEnabled"
import { setSelectionTarget } from "./useSelectionTarget"

const [setMultipleSelectionTargets, getMultipleSelectionTargets] = store<Array<SimpleObjectManager>>([])
export { getMultipleSelectionTargets }

export const pushMultipleSelectionTargets = push(setMultipleSelectionTargets, getMultipleSelectionTargets)
export const pullMultipleSelectionTargets = pull(setMultipleSelectionTargets, getMultipleSelectionTargets)
export const resetMultipleSelectionTargets = reset(setMultipleSelectionTargets, getMultipleSelectionTargets)

createEffect(() => {
    const enabled = getMultipleSelectionEnabled()
    const targets = getMultipleSelectionTargets()
    if (!targets.length || !enabled) return
    
    const group = new Group()
    scene.add(group)
    group.userData.isMultipleSelectionGroup = true
    
    const baseObject = new SimpleObjectManager(group)
    group.userData.manager = undefined
    setSelectionTarget(baseObject)
    
    const parentEntries: Array<[Object3D, Object3D]> = []
    for (const { outerObject3d: target } of targets) {
        if (!target.parent) continue
        parentEntries.push([target, target.parent])
        group.attach(target)
    }

    box3.setFromObject(group)
    for (const [object, parent] of parentEntries)
        parent.attach(object)

    group.position.copy(box3.getCenter(vector3))
    for (const [object] of parentEntries)
        group.attach(object)

    return () => {
        setSelectionTarget(undefined)

        for (const [object, parent] of parentEntries)
            parent.attach(object)

        baseObject.dispose()
        scene.remove(group)
    }
}, [getMultipleSelectionTargets, getMultipleSelectionEnabled])