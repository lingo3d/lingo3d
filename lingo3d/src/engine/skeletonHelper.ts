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

    const { loadedObject3d } = target
    if (!loadedObject3d || !skinnedMeshSet.has(loadedObject3d)) return

    const helper = new SkeletonHelper(loadedObject3d)
    scene.add(helper)

    return () => {
        scene.remove(helper)
    }
}, [getSelectionTarget, getCameraRendered])
