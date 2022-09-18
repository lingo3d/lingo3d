import { createEffect } from "@lincode/reactivity"
import { SkeletonHelper } from "three"
import Loaded from "../display/core/Loaded"
import { skinnedMeshSet } from "../display/utils/cloneSkinnedMesh"
import { getCameraRendered } from "../states/useCameraRendered"
import { getSelectionTarget } from "../states/useSelectionTarget"
import mainCamera from "./mainCamera"
import scene from "./scene"

createEffect(() => {
    const target = getSelectionTarget()
    if (!(target instanceof Loaded) || getCameraRendered() !== mainCamera)
        return

    const skinnedMesh = target.loadedGroup.children[0]
    if (!skinnedMeshSet.has(skinnedMesh)) return

    const helper = new SkeletonHelper(skinnedMesh)
    scene.add(helper)

    return () => {
        scene.remove(helper)
    }
}, [getSelectionTarget, getCameraRendered])
