import { createEffect } from "@lincode/reactivity"
import { SkeletonHelper } from "three"
import Loaded from "../display/core/Loaded"
import { getSelectionTarget } from "../states/useSelectionTarget"
import scene from "./scene"
import { skinnedMeshSet } from "../collections/skinnedMeshSet"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import FoundManager from "../display/core/FoundManager"

createEffect(() => {
    let [target] = selectionTargetPtr
    if (target instanceof FoundManager) target = target.owner
    if (
        !target ||
        !(target instanceof Loaded) ||
        !("$object" in target) ||
        !target.$object.parent
    )
        return

    const { $loadedObject } = target
    if (!$loadedObject || !skinnedMeshSet.has($loadedObject)) return

    const helper = new SkeletonHelper($loadedObject)
    scene.add(helper)

    return () => {
        scene.remove(helper)
        helper.dispose()
    }
}, [getSelectionTarget])
