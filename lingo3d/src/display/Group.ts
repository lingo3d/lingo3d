import { createEffect } from "@lincode/reactivity"
import { Group as ThreeGroup, Object3D } from "three"
import { hiddenAppendables } from "../api/core/collections"
import scene from "../engine/scene"
import { onEditorGroupItems } from "../events/onEditorGroupItems"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import IGroup, { groupDefaults, groupSchema } from "../interface/IGroup"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { setSelectionTarget } from "../states/useSelectionTarget"
import SimpleObjectManager from "./core/SimpleObjectManager"
import VisibleObjectManager from "./core/VisibleObjectManager"
import { box3, vector3 } from "./utils/reusables"

export default class Group
    extends VisibleObjectManager<ThreeGroup>
    implements IGroup
{
    public static componentName = "group"
    public static defaults = groupDefaults
    public static schema = groupSchema

    public constructor() {
        super(new ThreeGroup())
    }
}

createEffect(() => {
    const [targets] = getMultipleSelectionTargets()
    if (!targets.size) return

    const group = new ThreeGroup()
    scene.add(group)

    const groupManager = new SimpleObjectManager(group)
    hiddenAppendables.add(groupManager)
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

        const consolidatedGroup = new Group()
        consolidatedGroup.position.copy(group.position)
        for (const target of targets) consolidatedGroup.attach(target)

        emitSelectionTarget(consolidatedGroup)
    })

    return () => {
        if (!groupManager.done && !consolidated)
            for (const [object, parent] of parentEntries) parent.attach(object)

        groupManager.dispose()
        scene.remove(group)
        handle.cancel()
    }
}, [getMultipleSelectionTargets])
